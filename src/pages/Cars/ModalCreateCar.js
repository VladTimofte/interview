import {  Modal, Form, Input } from 'antd';
import { useEffect } from 'react'

const ModalCreateCar = ({save, form, hide, record}) => {

  const calculateTaxShelterbyCC = val => {
    if (!val) return 0
    if (val <= 1500) return 50
    if (val > 1500 && val < 2000) return 100
    if (val >= 2000) return 200
  }

  useEffect(() => {
	if (!record || !form) return
	form.setFieldsValue({
		make: record?.make,
		model: record?.model,
		manufacturingYear: record?.manufacturingYear,
		cilindricalCapacity: record?.cilindricalCapacity,
		taxShelter: record?.taxShelter,
	})
}, [form, record])

  const handleTaxShelter = e => {
    const val = Number(e)
    if (val < 4 || !val) return
    form.setFieldsValue({
      taxShelter: calculateTaxShelterbyCC(val)
    })
    
  }

  return (
    <Modal title="Add Car" 
    open={record}
    onOk={() => {
      form.validateFields().then(save)
    }} 
    onCancel={hide}>
         <Form form={form} layout='vertical'>
        <div className='row'>
        <Form.Item
			name='make'
			label='Make'
			rules={[
        {
          required: true,
          message: "Please enter Make",
        },
      ]}
			required >
				<Input />
		</Form.Item>
        <Form.Item
			name='model'
			label='Model'
			rules={[
        {
          required: true,
          message: "Please enter model",
        },
      ]}
			required >
				<Input />
		</Form.Item>
        </div>
        <div className='row'>
        <Form.Item
			name='manufacturingYear'
			label='Manufacturing Year'
			rules={[
        {
          required: true,
          max: 4,
        },
      ]}
			required >
				<Input />
		</Form.Item>
        <Form.Item
			name='cilindricalCapacity'
			label='Cilindrical Capacity'
      onChange={e => handleTaxShelter(e?.target?.value)}
			rules={[
        {
          required: true,
          max: 4,
        },
      ]}
			required >
				<Input />
		</Form.Item>
        </div>
        <div className='row'>
            <Form.Item
          name='taxShelter'
          label='Tax Shelter'
          rules={[
            {
              required: true,
              max: 4,
            },
          ]}
          required >
            <Input />
        </Form.Item>
        </div>
        </Form>
      </Modal>
  )
}

export default ModalCreateCar