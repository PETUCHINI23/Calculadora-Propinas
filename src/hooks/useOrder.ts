import { useEffect, useState } from 'react'
import type { MenuItem, OrderItem } from '../types'
// decidi agregar lo del local storage para que quede mas chicles bomba
const ORDER_KEY = 'order'
const TIP_KEY = 'tip'

const loadOrder = (): OrderItem[] => {
  try {
    const stored = localStorage.getItem(ORDER_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const loadTip = (): number => {
  try {
    const stored = localStorage.getItem(TIP_KEY)
    return stored ? Number(stored) : 0
  } catch {
    return 0
  }
}

export default function useOrder() {
  const [order, setOrder] = useState<OrderItem[]>(loadOrder)
  const [tip, setTip] = useState<number>(loadTip)

  useEffect(() => {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order))
  }, [order])

  useEffect(() => {
    localStorage.setItem(TIP_KEY, String(tip))
  }, [tip])

  const addItem = (item: MenuItem) => {
    const itemExists = order.find((orderItem) => orderItem.id === item.id)

    if (itemExists) {
      const updatedOrder = order.map((orderItem) =>
        orderItem.id === item.id
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem,
      )
      setOrder(updatedOrder)
    } else {
      const newItem: OrderItem = { ...item, quantity: 1 }
      setOrder([...order, newItem])
    }
  }

  const removeItem = (id: MenuItem['id']) => {
    setOrder(order.filter((item) => item.id !== id))
  }

  const placeOrder = () => {
    setOrder([])
    setTip(0)
  }

  return {
    order,
    tip,
    setTip,
    addItem,
    removeItem,
    placeOrder,
  }
}