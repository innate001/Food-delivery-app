import React, { useEffect, useRef, useState } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';
import { useNavigate } from 'react-router-dom';

export default function Card(props) {
    let navigate = useNavigate();
    let dispatch = useDispatchCart();
    let data = useCart();
    const priceRef = useRef();
    let options = props.options;
    let priceOptions = Object.keys(options);
    let foodItem = props.foodItem;

    const [qty, setQty] = useState(1);
    const [size, setSize] = useState("");

    useEffect(() => {
        if (priceRef.current) {
            setSize(priceRef.current.value);
        }
    }, []);

    const handleAddToCart = async () => {
        if (!foodItem) {
            console.error("foodItem is undefined");
            return;
        }

        let food = data.find(item => item.id === foodItem._id && item.size === size);

        let finalPrice = qty * parseInt(options[size]);

        if (food) {
            await dispatch({ type: "UPDATE", id: foodItem._id, price: finalPrice, qty: qty, size: size });
        } else {
            await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty: qty, size: size, img: foodItem.img });
        }
    };

    return (
        <div>
            <div className="card mt-3" style={{ "width": "18rem", "maxHeight": "360px" }}>
                {foodItem && (
                    <>
                        <img src={foodItem.img} className="card-img-top" alt="..." style={{ height: "120px", objectFit: "fill" }} />
                        <div className="card-body">
                            <h5 className="card-title">{foodItem.name}</h5>
                            <div className='container w-100'>
                                <select className='m-2 h-100 bg-success rounded' onChange={(e) => setQty(e.target.value)}>
                                    {Array.from(Array(6), (e, i) => {
                                        return (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        )
                                    })}
                                </select>
                                <select className='m-2 h-100 bg-success rounded' ref={priceRef} onChange={(e) => setSize(e.target.value)}>
                                    {priceOptions.map((data) => {
                                        return <option key={data} value={data}>{data}</option>
                                    })}
                                </select>
                                <div className='d-inline h-100 fs-5'>
                                    ₹{qty * parseInt(options[size])}/-
                                </div>
                            </div>
                            <hr />
                            <button className={'btn btn-success justify-center ms-2'} onClick={handleAddToCart}>Add To Cart</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
