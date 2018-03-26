import React, { Component } from "react";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import TodoItem from "../todo-item/TodoItem";
import {
  fetchAllItems,
  updateItem,
  deleteItem,
  addItem
} from "../../actions/index";
import "./DashBoard.css";
ReactModal.setAppElement("#root");
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      todoText: null
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.changeTodoStatus = this.changeTodoStatus.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.handleSubmitModal = this.handleSubmitModal.bind(this);
  }
  handleOpenModal() {
    this.setState({ showModal: true });
  }

  onTextChange(e) {
    this.setState({ todoText: e.target.value });
  }
  handleSubmitModal(e) {
    console.log(this.state);
    if (this.state.todoText) {
      this.props.addItem({
        title: this.state.todoText
      });
      this.setState({ showModal: false, todoText: null });
    }
  }
  handleCloseModal() {
    this.setState({ showModal: false, todoText: null });
  }

  componentDidMount() {
    this.props.fetchAllItems();
  }
  changeTodoStatus(key) {
    this.props.updateItem({
      _id: key.todoId,
      isActive: !key.todoActive
    });
  }
  deleteItem(key) {
    this.props.deleteItem({
      _id: key.todoId
    });
  }

  renderItems() {
    if (this.props.items.allItems) {
      return (
        <div className="dashboard">
          {this.props.items.allItems.map((item, i) => (
            <TodoItem
              todoTitle={item.title}
              todoActive={item.isActive}
              todoId={item._id}
              key={item._id}
              changeTodoStatus={this.changeTodoStatus.bind(this)}
              deleteItem={this.deleteItem.bind(this)}
            />
          ))}

          <div className="fixed-action-btn">
            <div
              to="/blogs/new"
              className="btn-floating btn-large red"
              onClick={this.handleOpenModal}
            >
              <i className="material-icons">add</i>
            </div>
          </div>
          <ReactModal
            isOpen={this.state.showModal}
            contentLabel="onRequestClose Example"
            onRequestClose={this.handleCloseModal}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
          >
            <h6>Add a new item</h6>
            <input
              type="text"
              value={this.state.comment}
              onChange={this.onTextChange.bind(this)}
              placeholder="Write a comment..."
            />
            <div className="row">
              <div className="col s6">
                {" "}
                <button
                  className="btn waves-effect waves-light todo-add-cancel"
                  type="submit"
                  name="action"
                  onClick={this.handleCloseModal}
                >
                  Cancel
                </button>
              </div>
              <div className="col s6">
                <button
                  className="btn waves-effect waves-light todo-add-submit"
                  type="submit"
                  name="action"
                  onClick={this.handleSubmitModal}
                >
                  Save
                </button>
              </div>
            </div>
          </ReactModal>
        </div>
      );
    }
  }

  render() {
    if (this.props.items.isFetching) {
      return (
        <div className="dashboard">
          <div className="preloader-wrapper small active">
            <div className="spinner-layer spinner-green-only">
              <div className="circle-clipper left">
                <div className="circle" />
              </div>
              <div className="gap-patch">
                <div className="circle" />
              </div>
              <div className="circle-clipper right">
                <div className="circle" />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div>{this.renderItems()}</div>;
    }
  }
}
function bindAction(dispatch) {
  return {
    fetchAllItems: () => dispatch(fetchAllItems()),
    addItem: obj => dispatch(addItem(obj)),
    updateItem: obj => dispatch(updateItem(obj)),
    deleteItem: obj => dispatch(deleteItem(obj))
  };
}
function mapStateToProps(state) {
  return { items: state.items };
}

export default connect(mapStateToProps, bindAction)(Dashboard);
