import {React, useContext} from 'react'
import { ContextHead } from '../App';

export default function RandomGenerator() {
  const {masterList} = useContext(ContextHead);
  return (
    <div>randomGenerator</div>
  )
}
