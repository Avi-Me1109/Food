'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function GroceriesPage() {
  // 1. Create a state to hold the list of groceries

  type GroceryItem = {
    id: number
    name: string
    quantity: number
    unit: string
  }

  const [groceries, setGroceries] = useState<GroceryItem[]>([])
  const supabase = createClient()

  // 2. Fetch the data when the component loads
  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('grocery_items').select('*')
      if (data) {
        setGroceries(data)
      }
    }
    getData()
  }, [supabase])

  // 3. Create a function to handle adding a new item
  const handleAddItem = async () => {
    // console.log('--- Add Item Clicked ---');

    // // Get the current user session
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // // Log what we found
    // console.log('User object:', user);
    // if (userError) {
    //   console.error('Error getting user:', userError);
    // }
    
    if (user) {
      console.log('Attempting to insert with user ID:', user.id);
      const { data, error } = await supabase
        .from('grocery_items')
        .insert([
          { 
            name: 'New Item', 
            quantity: 1, 
            unit: 'pcs',
            user_id: user.id 
          }
        ])
        .select();
      
      if (error) {
        // This is the error you are currently seeing
        console.error('Error adding item:', error); 
      } else {
        console.log('Successfully added item:', data);
        setGroceries(prevGroceries => [...prevGroceries, ...data]);
      }
    } else {
      console.log('No user was found. Insert operation cancelled.');
    }
  }

    const handleDeleteItem = async () => {
    // console.log('--- Add Item Clicked ---');

    // // Get the current user session
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // // Log what we found
    // console.log('User object:', user);
    // if (userError) {
    //   console.error('Error getting user:', userError);
    // }
    
    if (user) {
      console.log('Attempting to insert with user ID:', user.id);
      const { data, error } = await supabase
        .from('grocery_items')
        .insert([
          { 
            name: 'New Item', 
            quantity: 1, 
            unit: 'pcs',
            user_id: user.id 
          }
        ])
        .select();
      
      if (error) {
        // This is the error you are currently seeing
        console.error('Error adding item:', error); 
      } else {
        console.log('Successfully added item:', data);
        setGroceries(prevGroceries => [...prevGroceries, ...data]);
      }
    } else {
      console.log('No user was found. Insert operation cancelled.');
    }
  }

  // 4. Render the UI
  return (
    <div>
      <h1>My Groceries</h1>
      <button onClick={handleAddItem}>Add New Item</button>
      <ul>
        {groceries.map((item) => (
          <li key={item.id}>{item.name} - {item.quantity} {item.unit}</li>
        ))}
      </ul>
    </div>
  )
}