import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Dashboard(props) {
  const [state, setState] = useState({ //StateData
    foods: [] as any, //Food
    editingFood: {} as any, //Food
    modalOpen: false,
    editModalOpen: false,
  });

  useEffect (() => {
    const response = await api.get('/foods');

    setState({ foods: response.data } as any);
  }, []);

  const handleAddFood = async (food : any) => {
    const { foods } = state;

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setState({
        foods: [...foods, response.data],
        editingFood: state.editingFood,
        modalOpen: state.modalOpen,
        editModalOpen: state.editModalOpen
      });
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food : any) => {
    const { foods, editingFood } = state;

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map((f: any) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setState({
        foods: foodsUpdated,
        editingFood: state.editingFood,
        modalOpen: state.modalOpen,
        editModalOpen: state.editModalOpen
      });
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    const { foods } = state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food: any) => food.id !== id);

    setState({
      foods: foodsFiltered,
      editingFood: state.editingFood,
        modalOpen: state.modalOpen,
        editModalOpen: state.editModalOpen
    });
  }

  const toggleModal = () => {
    const { modalOpen } = state;

    setState({ modalOpen: !modalOpen });
  }

  const toggleEditModal = () => {
    const { editModalOpen } = state;

    setState({ editModalOpen: !editModalOpen });
  }

  const handleEditFood = (food: any) => {
    setState({ editingFood: food, editModalOpen: true });
  }

  const { modalOpen, editModalOpen, editingFood, foods } = state;

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map((food: any) => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
};
