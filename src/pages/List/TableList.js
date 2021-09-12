/* eslint-disable  */
import React, { PureComponent } from 'react'

import { Table, Tag, Button, Drawer, Form, Input, Select } from "antd";

import { studentService } from '../../services/student'


const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
export default class TableList extends PureComponent {
  state = {
    visible: false,
    columns: [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Tags",
        key: "tags",
        dataIndex: "tags",
        render: (tags) => (
          <>
            {tags.map((tag) => {
              let color = tag.length > 5 ? "geekblue" : "green";
              if (tag === "loser") {
                color = "volcano";
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <div size="middle">
            <Button
              icon="edit"
              type="primary"
              style={{ marginRight: '5px' }}
              onClick={() => this.onEdit(record)}
            >
              Edit
            </Button>
            <Button
              icon="delete"
              type="danger"
              onClick={() => this.onDelete(record)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    data: [],
    user: {},
    isEdit: false,
  };

  async componentDidMount() {
    const students = await studentService.search();

    this.setState({
      data: students
    })
  }

  onEdit = (record) => {
    const { data } = this.state

    const user = data.find((item) => item.id === record.id);

    this.setState({
      user,
      isEdit: true,
      visible: true,
    });
  }

  onDelete = async (record) => {
    const { data } = this.state;

    await studentService.delete(record.id)

    this.setState({
      data: data.filter(item => item.id !== record.id)
    });
  }

  showDrawer = () => {
    this.setState({
      visible: true,
      isEdit: false,
      user: {}
    });
  }

  onClose = () => {
    this.setState({
      visible: false,
      user: {},
    });
  }

  render() {
    const { columns, data, isEdit, visible, user = {} } = this.state
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 0'
        }}
        >
          <h1 style={{
            fontSize: '20px',
            marginBottom: 0
          }}
          >User management
          </h1>
          <Button
            icon='user-add'
            type="primary"
            onClick={() => this.showDrawer()}
          >
            Add
          </Button>
        </div>
        <Table style={{ background: 'white' }} columns={columns} dataSource={data} />
        <Drawer
          title={isEdit ? "Update user" : "Add new a user"}
          placement="right"
          onClose={() => this.onClose()}
          visible={visible}
          width="400"
        >
          <Form
            name="user-management"
            onSubmit={(e) => {
              e.preventDefault();

              this.props.form.validateFields(async (err, values) => {
                if (!err) {
                  if (isEdit) {
                    await studentService.update(this.state.user.id, values)
                  } else {
                    await studentService.create(values)
                  }

                  const students = await studentService.search();

                  this.setState({
                    visible: false,
                    data: students
                  });
                }
              });
            }}
          >
            {user.name}
            <FormItem name="name">
              {
                getFieldDecorator('name', { initialValue: user.name })(<Input
                  name="name"
                  size="large"
                  placeholder="Enter the name"
                />)
              }
            </FormItem>

            <FormItem name="age">
              {
                getFieldDecorator('age', { initialValue: user.age })(<Input
                  size="large"
                  placeholder="Enter the age"
                />)
              }
            </FormItem>

            <FormItem name="address">
              {
                getFieldDecorator('address', { initialValue: user.address })(<Input
                  size="large"
                  placeholder="Enter the address"
                />)
              }
            </FormItem>

            <FormItem name="tags">
              {
                getFieldDecorator('tags', { initialValue: user.tags })(
                  <Select mode="tags" placeholder="Enter the tags" size="large">
                    <Option key="1">Front end</Option>
                    <Option key="2">Back end</Option>
                    <Option key="3">Full stack</Option>
                  </Select>
                )
              }</FormItem>
            <Button
              htmlType="submit"
              size="large"
              style={{ width: "100%" }}
              type="primary"
            >
              Save
            </Button>
          </Form>
        </Drawer>
      </div>

    )
  }
}
