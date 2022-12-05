import { Button, Table, Form, Input, Popconfirm } from "antd";
import { useEffect, useState, useMemo } from "react";
import { CheckOutlined, CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import uniqid from 'uniqid';

import useCars from '../../data/useCars'
import ModalCreateCar from "./ModalCreateCar";
import { randomNumber } from "../../utils/numbers";

const { Search } = Input

function Cars() {
  const { data, update, remove } = useCars()
  const [dataSource, setDataSource] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [showAddCarsModal, setShowAddCarsModal] = useState(false)
  const [searchValue, setSearchValue] = useState()
  const [form] = Form.useForm();

  useEffect(() => {
    if(!data) return
    setDataSource(data);
  }, [data]);

  const handleEdit = rec => {
    setEditingRow(rec?.key);
    form.setFieldsValue({
      currentNumber: rec?.currentNumber,
      make: rec?.make,
      model: rec?.model,
      manufacturingYear: rec?.manufacturingYear,
      cilindricalCapacity: rec?.cilindricalCapacity,
      taxShelter: rec?.taxShelter,
    });
  }

  const handleSave = record => {
    const fields = form.getFieldsValue()
    const dataToBeSaved = {...fields, id: record?.id, key: record?.key}
    update(dataToBeSaved).then(() => setEditingRow(null))
  }

  const handleCreateCar = record => {
    const fields = form.getFieldsValue()
    const dataToBeSaved = {...fields, id: record.id, key: uniqid(), currentNumber: randomNumber(10000000, 99999999)}
    update(dataToBeSaved).then(() => setShowAddCarsModal(false))
  }

  const handleClickAddCar = () => {
    form.resetFields()
    setShowAddCarsModal(true)
  }

  const calculateTaxShelterbyCC = val => {
    if (!val) return 0
    if (val <= 1500) return 50
    if (val > 1500 && val < 2000) return 100
    if (val >= 2000) return 200
  }

  const handleTaxShelter = e => {
    const val = Number(e)
    if (val < 4 || !val) return
    form.setFieldsValue({
      taxShelter: calculateTaxShelterbyCC(val)
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
      title: "Make",
      dataIndex: "make",
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="make"
              rules={[
                {
                  required: true,
                  message: "Please enter make",
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
      title: "Modal",
      dataIndex: "model",
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="model"
              rules={[
                {
                  required: true,
                  message: "Please enter model",
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
      title: "Manufacturing year",
      dataIndex: "manufacturingYear",
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="manufacturingYear"
              rules={[
                {
                  required: true,
                  max: 4,
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
      title: "Cilindrical Capacity",
      dataIndex: "cilindricalCapacity",
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="cilindricalCapacity"
              onChange={e => handleTaxShelter(e?.target?.value)}
              rules={[
                {
                  required: true,
                  max: 4,
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
      title: "Tax Shelter",
      dataIndex: "taxShelter",
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="taxShelter"
              rules={[
                {
                  required: true,
                  max: 4,
                },
              ]}
            >
              <Input type="number" disabled />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
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
							title={`Are you sure you want to delete ${record.make} ${record.model}`}
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
			const fullCarName = `${i.make} ${i.model}`
			if (fullCarName.toLowerCase().includes(search)) return true
			if (i.externalID?.toLowerCase().includes(search)) return true
			if (i.customID?.toLowerCase().includes(search)) return true
			return false
		})
	}, [searchValue, dataSource])


  return (
    <div className="persons">
      <div className="action-buttons">
      <div className="row-justify-items-center">
          <Search placeholder='Search' allowClear onChange={(e) => setSearchValue(e?.target?.value)} style={{width: 450}} />
        </div>
        <div className="row-justify-items-start">
          <Button  onClick={() => handleClickAddCar()} type="primary">Add Car</Button>
        </div>
       <div /><div /><div /><div /><div /><div /><div /><div /><div />
      </div>
      <header className="header">
        <Form form={form} onFinish={onFinish}>
          <Table columns={columns} dataSource={filteredData}></Table>
        </Form>
        <ModalCreateCar 
        save={handleCreateCar}
        form={form}
        showAddCarsModal={showAddCarsModal}
        hide={() => setShowAddCarsModal(false)} />
      </header>
    </div>
  );
}

export default Cars;