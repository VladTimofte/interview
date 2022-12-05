import { Button, Table, Form, Input, Popconfirm } from "antd";
import { useEffect, useState, useMemo } from "react";
import { LoadingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import uniqid from 'uniqid';

import usePersons from '../../data/usePersons';
import useCars from '../../data/useCars';
import ModalCreatePerson from "./ModalCreatePerson";
import { randomNumber } from '../../utils/numbers';

const { Search } = Input

function Persons() {
  const { data, update, remove } = usePersons()
  const { data: cars } = useCars()
  const [dataSource, setDataSource] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [searchValue, setSearchValue] = useState()
  const [form] = Form.useForm();

  useEffect(() => {
    if(!data) return
    setDataSource(data);
  }, [data]);

  const parsedCarsOptions = useMemo(() => {
	return cars?.map(el => {
	  return { label: `${el?.make} ${el?.model}`, value: el?.id }
	})
  },[cars])

  const handleEdit = rec => {
    setEditingRow(rec);
  }

  const saveData = record => {
	debugger
	form.validateFields().then(() => {
		const fields = form.getFieldsValue()
		const dataToBeSaved = {...fields, id: editingRow?.id || uniqid(), key: record?.key || uniqid(), currentNumber: record?.currentNumber || randomNumber(10000000, 99999999)}
		update(dataToBeSaved).then(() => setEditingRow(null))
	})
  }

  const handleClickAddPerson = () => {
    form.resetFields()
    setEditingRow({})
  }

  const columns = [
    {
      title: "Current Number",
      dataIndex: "currentNumber",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "CNP",
      dataIndex: "cnp",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Cars Owned",
      dataIndex: "carsOwned",
	  render: (text, record) => { return record?.carsOwned?.map(id =>  <p>{parsedCarsOptions?.find(el => el?.value === id)?.label}</p>); }
	},
    {
      render: (_, record) => {
        return (
          <>
            {editingRow?.key === record?.key ? (
              <LoadingOutlined />
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
        save={saveData}
        form={form}
        record={editingRow}
        hide={() => setEditingRow(null)} />
      </header>
    </div>
    </>
  );
}

export default Persons;