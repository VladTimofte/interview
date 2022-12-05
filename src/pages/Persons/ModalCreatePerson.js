import {  Modal, Form, Input, Select } from 'antd';
import { CNP } from 'romanian-personal-identity-code-validator';

import useCars from '../../data/useCars'
import { getAge } from '../../utils/numbers';

const ModalCreatePerson = ({save, form, hide, showAddPersonModal}) => {
    const { data: cars } = useCars()

    const handleCNPInput = async e => {
      const val = Number(e)
      if (val < 13 || !val) return
      let codNumericPersonal = await new CNP(e)
      const yearsOld = getAge(codNumericPersonal.getBirthDate())
      form.setFieldsValue({
        age: yearsOld
      })
    }

  return (
    <Modal title="Add Person" 
    open={showAddPersonModal}
    onOk={() => {
      form.validateFields().then(save)
    }} 
    onCancel={hide}>
         <Form form={form} layout='vertical'>
        <div className='row'>
        <Form.Item
			name='firstName'
			label='First Name'
			rules={[
        {
          required: true,
          message: "Please enter first name",
        },
      ]}
			required >
				<Input />
		</Form.Item>
        <Form.Item
			name='lastName'
			label='Last Name'
			rules={[
        {
          required: true,
          message: "Please enter last name",
        },
      ]}
			required >
				<Input />
		</Form.Item>
        </div>
        <div className='row'>
        <Form.Item
			name='cnp'
			label='CNP'
      onChange={e => handleCNPInput(e?.target?.value)}
			rules={[
        {
          required: true,
          max: 13,
        },
      ]}
			required >
				<Input />
		</Form.Item>
        <Form.Item
			name='age'
			label='Age'
			rules={[
        {
          required: true,
          max: 3,
        },
      ]}
			required >
				<Input />
		</Form.Item>
        </div>
        <div className='row'>
        <Form.Item
              name="carsOwned"
              label="Cars Owned"
              rules={[
                {
                  required: true,
                  message: "Please enter cars owned",
                },
              ]}
            >
						<Select
							options={cars}
							mode='multiple'
						/>
            </Form.Item>
        </div>
        </Form>
      </Modal>
  )
}

export default ModalCreatePerson