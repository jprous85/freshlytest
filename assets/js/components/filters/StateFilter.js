import React from 'react';
import {getLocalStorage} from '../../utils/OrderFunctions';

const StateFilter = (props) => {
    const {order_states} = getLocalStorage();
    const {changeState, setChangeState} = props;
    return (
        <div>
            <select name="" id="" className="form-control" onChange={(e) => {
                setChangeState(e.target.value);
            }}>
                <option value="">Select a status</option>
                {order_states.map(os => <option key={os.id} value={os.id}>{os.name}</option>)}
            </select>
        </div>
    );
}

export default StateFilter;