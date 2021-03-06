import React, { Component } from "react";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import TodoItem from "../todo-item/TodoItem";
import {
  fetchAllItems,
  updateItem,
  deleteItem,
  addItem,
  checkLogin
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
      showItemModal: false,
      showConfirmModal: false,
      selectedItemId: null,
      todoText: null
    };
    this.openItemModal = this.openItemModal.bind(this);
    this.openConfirmModal = this.openConfirmModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.changeTodoStatus = this.changeTodoStatus.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onSubmitItemModal = this.onSubmitItemModal.bind(this);
    this.onSubmitConfirmModal = this.onSubmitConfirmModal.bind(this);
  }
  openItemModal() {
    this.setState({ showItemModal: true });
    console.log("State", this.state);
  }
  openConfirmModal(key) {
    this.setState({ showConfirmModal: true, selectedItemId: key.todoId });
  }

  onTextChange(e) {
    this.setState({ todoText: e.target.value });
  }
  onSubmitItemModal(e) {
    if (this.state.todoText) {
      this.props.addItem({
        title: this.state.todoText,
        _user: localStorage.getItem("todoId")
      });
      this.setState({ showItemModal: false, todoText: null });
    }
  }
  onSubmitConfirmModal(key) {
    this.setState({ showConfirmModal: false });
    if (this.state.selectedItemId) {
      this.props.deleteItem({
        _id: this.state.selectedItemId,
        _user: localStorage.getItem("todoId")
      });
    }
  }
  handleCloseModal() {
    this.setState({
      showItemModal: false,
      showConfirmModal: false,
      todoText: null
    });
  }

  componentDidMount() {
    this.props.checkLogin();
    if (localStorage.getItem("todoId")) {
      this.props.fetchAllItems({ userId: localStorage.getItem("todoId") });
    } else {
      this.props.history.push("/auth/login");
    }
  }
  changeTodoStatus(key) {
    this.props.updateItem({
      _id: key.todoId,
      isActive: !key.todoActive,
      _user: localStorage.getItem("todoId")
    });
  }
  renderAddButton() {
    return (
      <div className="fixed-action-btn">
        <div
          className="btn-floating btn-large red"
          onClick={this.openItemModal}
        >
          <i className="material-icons">add</i>
        </div>
      </div>
    );
  }
  renderModals() {
    return (
      <div>
        <ReactModal
          isOpen={this.state.showItemModal}
          contentLabel="onRequestClose Example"
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick={false}
          style={customStyles}
        >
          <div className="row text-center">
            <h6>Add a new item</h6>
          </div>
          <input
            type="text"
            value={this.state.comment}
            maxLength="28"
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
                onClick={this.onSubmitItemModal}
              >
                Save
              </button>
            </div>
          </div>
        </ReactModal>
        <ReactModal
          isOpen={this.state.showConfirmModal}
          contentLabel="onRequestClose Example"
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick={false}
          style={customStyles}
        >
          <div className="row text-center">
            <h6>Are you sure?</h6>
          </div>
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
                onClick={this.onSubmitConfirmModal}
              >
                Save
              </button>
            </div>
          </div>
        </ReactModal>
      </div>
    );
  }

  renderItems() {
    if (this.props.items.allItems && this.props.items.allItems.length) {
      return (
        <div className="dashboard">
          {this.props.items.allItems.map((item, i) => (
            <TodoItem
              todoTitle={item.title}
              todoActive={item.isActive}
              todoId={item._id}
              key={item._id}
              changeTodoStatus={this.changeTodoStatus.bind(this)}
              deleteItem={this.openConfirmModal.bind(this)}
            />
          ))}
          {this.renderAddButton()}
          {this.renderModals()}
        </div>
      );
    } else {
      return (
        <div className="dashboard">
          <div className="empty-text">Your list is empty</div>

          {this.renderAddButton()}
          {this.renderModals()}
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
    fetchAllItems: obj => dispatch(fetchAllItems(obj)),
    addItem: obj => dispatch(addItem(obj)),
    updateItem: obj => dispatch(updateItem(obj)),
    deleteItem: obj => dispatch(deleteItem(obj)),
    checkLogin: () => dispatch(checkLogin())
  };
}
function mapStateToProps(state) {
  return { items: state.items, auth: state.auth };
}

export default connect(mapStateToProps, bindAction)(Dashboard);
