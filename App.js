import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  CheckBox,
  Switch,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView
} from "react-native";

const defaultList = [];

export default class ToDoApp extends React.Component {
  constructor(props) {
    super();
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      currentInput: '',
      list: props.list,
      doneList: props.doneList
    };
    this.doneList = [...props.doneList];
    this.list = [...this.state.list];
  }

  componentWillUpdate(nextProps, nextState) {
    this.doneList = [];
    this.list = [...nextState.list];
  }
  render() {
    const currentInputChange = (e) => {
      this.setState({
        currentInput: e?.target?.value,
      })
    }
    return (
      <ScrollView style={styles.App}>
        <View id="list" style={styles.widgetUl}>
          <View style={styles.header}>
            <Text style={(styles.textHd, styles.App)} lassName="title">
              My to do list{" "}
            </Text>
          </View>
        </View>
        <View id="list" style={styles.widgetUl}>
          <View className="add_reset_section" style={styles.addResetSection}>
            <TextInput
              style={styles.input}
              ref={ref => (this.newItem = ref)}
              value={this.state.currentInput}
              onChange={currentInputChange}
              placeholder="Add a new task..."
            />
          </View>
          <View className="button add" style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={this._handleAddItem}
              title="Add"
              style={styles.button}
            >
              <Text style={styles.textBt}>Add </Text>
            </TouchableOpacity>
          </View>
          <View className="button reset" style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={this._handleResetList}
              title="Reset to default"
              style={styles.button}
            >
              <Text style={styles.textBt}>Reset </Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.list.map((value, i) => {
          const handleItemEdited = (newValue) => {
            const editedList = [...this.state.list];
            const itemIndex = editedList.findIndex((item) => item == value)

            editedList[itemIndex] = newValue;

            this.setState({
              list: editedList,
            })
          }

          return (
            <ToDoListItem
              id={i}
              key={i}
              item={value}
              onEdited={handleItemEdited}
              removeItem={this._handleUpdateDoneList}
            />
          );
        })}
        <View id="list" style={styles.widgetUl}>
          <TouchableOpacity
            onPress={this._handleRemoveDoneItems}
            title="Remove"
            style={styles.buttonRemove}
          >
            <Text style={styles.textBt}>Remove </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
  _handleAddItem = () => {
    if (this.state.currentInput !== "") {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      
      this.setState({ list: [...this.state.list, this.state.currentInput] });
      
      this.newItem.clear();

      this.setState({
        currentInput: '',
      });
    }
  };

  _handleResetList = () => {
    this.setState({ list: defaultList });
  };

  _handleUpdateDoneList = id => {
    let checkIfInDoneList = this.doneList.filter(function(val) {
      return val === id;
    });
    if (checkIfInDoneList === undefined || checkIfInDoneList.length === 0) {
      // add to list
      this.doneList.push(id);
    } else {
      //delete from list
      this.doneList = this.doneList.filter(function(val) {
        return val !== id;
      });
    }
  };

  _handleRemoveDoneItems = e => {
    this.doneList.sort((a, b) => a - b);
    for (var i = this.doneList.length - 1; i >= 0; i--)
      this.list.splice(this.doneList[i], 1);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({ list: [...this.list] });
    this.doneList = [];
  };
}
ToDoApp.propTypes = {
  list: PropTypes.array
};

ToDoApp.defaultProps = {
  list: defaultList,
  doneList: []
};

class ToDoListItem extends React.Component {
  constructor(props) {
    super();
    this.state = { value: props.item, checked: false, showEditField: false, };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== this.props.item)
      this.setState({ ...this.state, value: nextProps.item, checked: false });
  }
  _handleCheckBoxClick = e => {
    this.setState({
      checked: !this.state.checked
    });
    this.props.removeItem(this.props.id);
  };

  _handleEditItem = () => {
    this.setState({
      showEditField: true,
    })
  }

  _handleSaveEditedItem = () => {
    this.props.onEdited(this.state.value);

    this.setState({
      showEditField: false,
    })
  }

  render() {
    /** RENDER  **/
    let text = this.state.checked ? (
      <Text>{this.state.value}</Text>
    ) : (
      this.state.value
    );
    let checked = this.state.checked ? "checked" : "";

    const _handleEditChange = (e) => {
      this.setState({
        value: e?.target?.value,
      })
    }

    return (
      <View id="list" style={styles.widgetUl}>
        <View
          className="main"
          style={styles.main}
          style={{ flex: 11, flexBasis: 250, flexDirection: "row" }}
        >
          {Platform.OS === "android" ? (
            <CheckBox
              onValueChange={this._handleCheckBoxClick}
              value={this.state.checked}
            />
          ) : (
            <Switch
              onValueChange={this._handleCheckBoxClick}
              value={this.state.checked}
            />
          )}

          {this.state.showEditField
            ? (
              <View style={styles.addResetSection}>
                <TextInput
                  style={styles.input}
                  value={this.state.value}
                  onChange={_handleEditChange}
                />
              </View>
            )
            : <Text style={styles.textBd}>{text}</Text>
          }
          
          {
            this.state.showEditField
              ? (
                <View id="save" style={styles.widgetUl}>
                  <TouchableOpacity
                    onPress={this._handleSaveEditedItem}
                    title="Save"
                    style={styles.button}
                  >
                    <Text style={styles.textBt}>Save</Text>
                  </TouchableOpacity>
                </View>
              )
              : (
                <View id="edit" style={styles.widgetUl}>
                  <TouchableOpacity
                    onPress={this._handleEditItem}
                    title="Edit"
                    style={styles.button}
                  >
                    <Text style={styles.textBt}>Edit</Text>
                  </TouchableOpacity>
                </View>
              )
          }
      </View>
      </View>
    );
  }

  componentWillUnmount() {}
}
const styles = StyleSheet.create({
  App: {
    textAlign: "center",
    fontSize: 30,
    paddingTop: 10
  },
  widgetUl: {
    padding: 0,
    margin: 0,
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    alignItems: "center"
  },
  header: {
    flexBasis: 250,
    flex: 1,
    padding: 10
  },
  footer: {
    flexBasis: 250,
    flex: 1
  },
  main: {
    flex: 1,
    flexBasis: 250,
    padding: 10
  },
  addResetSection: {
    flex: 3,
    padding: 0
  },
  input: {
    paddingBottom: 15,
    paddingTop: 5,
    fontSize: 20,
    paddingLeft: 5
  },
  textBt: {
    color: "#fff"
  },
  textBd: {
    fontSize: 20
  },
  textHd: {
    fontSize: 30
  },
  button: {
    alignItems: "center",
    backgroundColor: "#f44336",
    padding: 12,
    marginRight: 5,
    flex: 2
  },
  buttonRemove: {
    alignItems: "center",
    backgroundColor: "#f44336",
    padding: 12,
    marginRight: 5,
    flexBasis: 150
  }
});

