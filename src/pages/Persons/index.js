import { Button, Table, Form, Input, Select, Popconfirm } from "antd";
import { useEffect, useState, useMemo } from "react";
import { CheckOutlined, CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { CNP } from 'romanian-personal-identity-code-validator';
import uniqid from 'uniqid';

import usePersons from '../../data/usePersons';
import useCars from '../../data/useCars';
import ModalCreatePerson from "./ModalCreatePerson";
import { randomNumber, getAge } from '../../utils/numbers';

const { Search } = Input

function Persons() {
  const { data, update, remove } = usePersons()
  const { data: cars } = useCars()
  const [dataSource, setDataSource] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false)
  const [searchValue, setSearchValue] = useState()
  const [form] = Form.useForm();

  const parsedCarsOptions = useMemo(() => {
    return cars?.map(el => {
      return { label: `${el?.make} ${el?.model}`, value: el?.id }
    })
  },[cars])

  useEffect(() => {
    if(!data) return
    setDataSource(data);
  }, [data]);

  const handleEdit = rec => {
    setEditingRow(rec?.key);
    form.setFieldsValue({
      currentNumber: rec?.currentNumber,
      firstName: rec?.firstName,
      lastName: rec?.lastName,
      cnp: rec?.cnp,
      age: rec?.age,
      carsOwned: rec?.carsOwned,
    });
  }

  function handleSave (record) {
    form.validateFields().then(() => {
      const fields = form.getFieldsValue()
      const dataToBeSaved = {...fields, id: record?.id, key: record?.key, cnp: Number(fields?.cnp)}
      update(dataToBeSaved).then(async () => setEditingRow(null))
  })
  }

  const handleCreatePerson = record => {
    const fields = form.getFieldsValue()
    const parseCarsOwned = fields.carsOwned.map(el => cars.find(i => el === i.value))
    const dataToBeSaved = {...fields, id: record.id, key: uniqid(), currentNumber: randomNumber(10000000, 99999999), carsOwned: parseCarsOwned}
    update(dataToBeSaved).then(() => setShowAddPersonModal(false))
  }

  const handleClickAddPerson = () => {
    form.resetFields()
    setShowAddPersonModal(true)
  }

  const handleCNPInput = async e => {
    const val = Number(e)
    if (val < 13 || !val) return
    let codNumericPersonal = await new CNP(e)
    const yearsOld = getAge(codNumericPersonal.getBirthDate())
    form.setFieldsValue({
      age: yearsOld
    })
  }

  const columns = [
    {
      title: "Current Number",
      dataIndex: "currentNumber",
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="currentNumber"
            >
              <Input disabled />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Please enter first name",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Please enter last mame",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "CNP",
      dataIndex: "cnp",
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="cnp"
              onChange={e => handleCNPInput(e?.target?.value)}
              rules={[
                {
                  required: true,
                  max: 13,
                  min: 13
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Age",
      dataIndex: "age",
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="age"
              rules={[
                {
                  required: true,
                  max: 3,
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Cars Owned",
      dataIndex: "carsOwned",
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="carsOwned"
              rules={[
                {
                  required: true,
                  message: "Please enter cars owned",
                },
              ]}
            >
						<Select
							options={parsedCarsOptions}
							mode='multiple'
						/>
            </Form.Item>
            
          );
        } else { 
        return record?.carsOwned?.map(id =>  <p>{parsedCarsOptions?.find(el => el?.value === id)?.label}</p> )};
        }
      },
    {
      render: (_, record) => {
        return (
          <>
            {editingRow === record.key ? (
              <>
              <CheckOutlined
               onClick={() => handleSave(record)} />
              <CloseOutlined
              onClick={() => {
                setEditingRow(null);
              }} />
              </>
            ) : (
              <>
              <EditOutlined
              onClick={() => {
                handleEdit(record)
               }} />
               <Popconfirm
							title={`Are you sure you want to delete ${record.firstName} ${record.lastName}`}
							onConfirm={() => remove(record.id)}
							okText='Yes'
							cancelText='No'
						>
              <DeleteOutlined />
						</Popconfirm>
               </>
            )}
          </>
        );
      },
    },
  ];

  const onFinish = (values) => {
    const updatedDataSource = [...dataSource];
    updatedDataSource.splice(editingRow, 1, { ...values, key: editingRow });
    setDataSource(updatedDataSource);
    setEditingRow(null);
  };

  const filteredData = useMemo(() => {
		if (!searchValue) return dataSource
		const search = searchValue.toLowerCase()
		return dataSource.filter(i => {
			const fullName = `${i.firstName} ${i.lastName}`
			if (fullName.toLowerCase().includes(search)) return true
			if (i.externalID?.toLowerCase().includes(search)) return true
			if (i.customID?.toLowerCase().includes(search)) return true
			return false
		})
	}, [searchValue, dataSource])

  return (
    <>
    <div className="persons">
      <div className="action-buttons">
        <div className="row-justify-items-center">
          <Search placeholder='Search' allowClear onChange={(e) => setSearchValue(e?.target?.value)} style={{width: 450}} />
        </div>
        <div className="row-justify-items-start">
          <Button  onClick={() => handleClickAddPerson()} type="primary">Add Person</Button>
        </div>
       <div /><div /><div /><div /><div /><div /><div /><div /><div />
      </div>
      <header className="header">
        <Form form={form} onFinish={onFinish}>
          <Table columns={columns} dataSource={filteredData}></Table>
        </Form>
        <ModalCreatePerson 
        save={handleCreatePerson}
        form={form}
        showAddPersonModal={showAddPersonModal}
        hide={() => setShowAddPersonModal(false)} />
      </header>
    </div>
    </>
  );
}

export default Persons;