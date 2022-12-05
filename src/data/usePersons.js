import useSWR from 'swr'
import uniqid from 'uniqid';
import {useEffect} from 'react'

import { getItemLC, setItemLC } from '../utils/ls'

const KEY = 'persons'

const DUMMY_DATA = [
    {
        id: 'asd304ir',
        key: uniqid(),
        currentNumber: 44364923,
        firstName: 'Vlad',
        lastName: 'Timofte',
        cnp: 1990619002395,
        age: 23,
        carsOwned: ['aapo1023']
    }, {
        id: 'sl03jfk5',
        key: uniqid(),
        currentNumber: 29230193,
        firstName: 'Beni',
        lastName: 'Smith',
        cnp: 1990619002395,
        age: 23,
        carsOwned: ['sldki5wl']
    }, {
        id: 'fkeodkcm',
        key: uniqid(),
        currentNumber: 99382746,
        firstName: 'Mike',
        lastName: 'Smith',
        cnp: 1990619002395,
        age: 23,
        carsOwned: ['ppcmwo29', 'sldki5wl']
    },
]

const fetcher = async () => new Promise((resolve, reject) => {
	setTimeout(() => { resolve(getItemLC(KEY) || []) }, 10)
})

const usePersons = id => {
	const { data, mutate, error } = useSWR(`/api/${KEY}/${id}`, fetcher)

    const items = data ? [...data] : []

    const update = async record => {
        if (!record) return
       const index = items.map(i => i?.id).indexOf(record?.id)
        // EDIT
        if (index !== -1) {
            let tempData = [...data]
            tempData.splice(index, 1, record);
           await setItemLC(KEY, tempData)
		   await mutate(tempData)
        } else {
            const tempData = {...record, id: uniqid()}
            const dataToBeSaved = [...data, tempData]
            await setItemLC(KEY, dataToBeSaved)
		   await mutate(dataToBeSaved)
        }
    }

    const remove = async id => {
        if (!id) return
    const index = items.map(i => i?.id).indexOf(id)
    let tempData = [...data]
    tempData.splice(index, 1);
    await setItemLC(KEY, tempData)
	await mutate(tempData)
    }

	useEffect(() => {
        if(getItemLC(KEY) && getItemLC(KEY)?.length !== 0 ) return
        setItemLC(KEY, DUMMY_DATA)
		mutate(DUMMY_DATA)
    }, [])

	return {
		data,
		loading: !error && !data,
        update,
        remove,
	}
}

export default usePersons