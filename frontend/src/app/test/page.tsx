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
  const [itemName, setItemName] = useState('')

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

    if(!user){
      return console.log("Error! No user found")
    }

    const {data: existing} = await supabase
      .from('grocery_items')
      .select('*')
      .eq('name', itemName)
      .eq('user_id', user.id)
      .single()
    
    if(existing){
      const { data, error } = await supabase
        .from('grocery_items')
        .update({quantity: existing.quantity + 1})
        .eq('id', existing.id)
        .select();
      
      if (error){
        console.error('Error adding item:', error);
      }

      else{
        setGroceries(
          prev => prev.map(i => i.id === existing.id ? data[0] : i)
        );
      }
    }

    else{
      const{data, error} = await supabase
        .from('grocery_items')
        .insert([
          { 
            name: itemName, 
            quantity: 1, 
            unit: 'pcs',
            user_id: user.id 
          }
        ])
        .select();

        if(error){
          console.error('Error adding item:', error);
        }
        else{
          setGroceries(prev => [...prev, ...data]);
        }
    };
  }

    const handleDeleteItem = async () => {
    // console.log('--- Add Item Clicked ---');

    // // Get the current user session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if(!user){
      return console.log("Error! No user found")
    }

    const {data: existing} = await supabase
      .from('grocery_items')
      .select('*')
      .eq('name', itemName)
      .eq('user_id', user.id)
      .single()

    if(!existing){
      console.log("Item does not exist");
      return;
    }

    if(existing.quantity <= 1){
      const{error} = await supabase
        .from('grocery_items')
        .delete()
        .eq('id', existing.id)

      if(error){
        console.error("Error adding item:", error);
      }
      else{
        setGroceries(prev => prev.filter(i => i.id !== existing.id));
      }
    }

    else{
      const { data, error } = await supabase
        .from('grocery_items')
        .update({quantity: existing.quantity - 1})
        .eq('id', existing.id)
        .select();
      
      if(error){
        console.error("Error decrementing item:", error);
      }

      else{
        setGroceries(
          prev => prev.map(i => i.id === existing.id ? data[0] : i)
        );
      }
    }
  }

  // 4. Render the UI
  return (
    <div>
      <h1>My Groceries</h1>
      <input
        type="text"
        id="name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Type item..."
      />
      <button style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={handleAddItem}>Add Item</button>
      <button style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={handleDeleteItem}>Delete Item</button>
      <ul>
        {groceries.map((item) => (
          <li key={item.id}>{item.name} - {item.quantity} {item.unit}</li>
        ))}
      </ul>
    </div>
  )
}