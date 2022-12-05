import useSWR from 'swr'
import uniqid from 'uniqid';
import {useEffect} from 'react'

import { getItemLC, setItemLC } from '../utils/ls'

const KEY = 'cars'

const DUMMY_DATA = [
{id: 'sldki5wl', make: 'VOLKSWAGEN', model: 'GOLF 6', manufacturingYear: 2009, cilindricalCapacity: 1495, taxShelter: 50, key: 'sldof923',  currentNumber: 29301382,},
{id: 'aapo1023', make: 'VOLKSWAGEN', model: 'PASSAT B6', manufacturingYear: 20012, cilindricalCapacity: 1500, taxShelter: 100, key: 'qq12lpdk',  currentNumber: 34049281,},
{id: 'ppcmwo29', make: 'AUDI', model: 'QUATRO A4', manufacturingYear: 20017, cilindricalCapacity: 2200, taxShelter: 200, key: 'aslpz0ei',  currentNumber: 23940356,},
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
            const indexOfExistedObj = data.map(obj => obj.id).indexOf(record?.id)
            tempData.splice(indexOfExistedObj, 1, record);
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