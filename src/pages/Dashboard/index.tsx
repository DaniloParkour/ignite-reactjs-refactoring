import Header from '../../components/Header';
import api from '../../services/api';
import Food, { FoodModel } from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Dashboard(props: any) {
  const [state, setState] = useState({ //StateData
    foods: [] as FoodModel[], //Food
    editingFood: {} as FoodModel, //Food
    modalOpen: false,
    editModalOpen: false,
  });

  useEffect(() => {
    api.get<FoodModel[]>('/foods').then((resp) => setState({
      foods: resp.data,
      editingFood: {} as FoodModel,
      modalOpen: false,
      editModalOpen: false
    })
    );
  }, []);

  const handleAddFood = async (food: FoodModel) => {
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

  const handleUpdateFood = async (food: FoodModel) => {
    const { foods, editingFood } = state;

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map((f: FoodModel) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setState({
        foods: foodsUpdated,
        editingFood: state.editingFood,
        modalOpen: state.modalOpen,
        editModalOpen: false
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

    setState({
      foods: state.foods,
      editingFood: state.editingFood,
      modalOpen: !modalOpen,
      editModalOpen: state.editModalOpen
    });
  }

  const toggleEditModal = () => {
    const { editModalOpen } = state;

    setState({
      foods: state.foods,
      editingFood: state.editingFood,
      editModalOpen: !editModalOpen,
      modalOpen: state.modalOpen
    });
  }

  const handleEditFood = (food: FoodModel) => {
    setState({
      foods: state.foods,
      editingFood: food,
      editModalOpen: true,
      modalOpen: state.modalOpen
    });
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
