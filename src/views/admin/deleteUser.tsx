import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pizzaService } from '../../service/service';
import View from '../general/view';
import Button from '../../components/button';

export default function DeleteUser() {
  const state = useLocation().state;
  const navigate = useNavigate();

  async function deleteUser() {
    await pizzaService.deleteUser(state.user);
    navigate('/admin-dashboard/users');
  }

  return (
    <View title='Delete user'>
      <div className='text-start py-8 px-4 sm:px-6 lg:px-8'>
        <div className='text-neutral-100'>
          Are you sure you want to delete the user <span className='text-orange-500'>{state.user.email}</span>? This action cannot be undone.
        </div>
        <Button title='Delete' onPress={deleteUser} />
        <Button title='Cancel' onPress={() => navigate('/admin-dashboard/users')} className='bg-transparent border-neutral-300' />
      </div>
    </View>
  );
}
