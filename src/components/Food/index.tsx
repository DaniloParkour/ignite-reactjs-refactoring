import { FiEdit3, FiTrash } from 'react-icons/fi';

import { Container } from './styles';
import api from '../../services/api';
import { useState } from 'react';

export interface FoodModel {
  id: number,
  name: string,
  description: string,
  price: string,
  available: boolean,
  image: string
}

interface FoodProps {
  food: FoodModel,
  handleDelete: (id: number) => void,
  handleEditFood: (food: FoodModel) => void
}

interface FoodState {
  isAvailable: boolean
}

export default function Food(props: FoodProps) {

  const [state, setState] = useState( { isAvailable: props.food.available } as FoodState);

  const toggleAvailable = async () => {
    const { food } = props;

    await api.put(`/foods/${food.id}`, {
      ...food,
      available: !state.isAvailable,
    });

    setState({ isAvailable: !state.isAvailable });
  }

  const { handleDelete, handleEditFood } = props;

  return (
   <Container available={state.isAvailable}>
        <header>
          <img src={props.food.image} alt={props.food.name} />
        </header>
        <section className="body">
          <h2>{props.food.name}</h2>
          <p>{props.food.description}</p>
          <p className="price">
            R$ <b>{props.food.price}</b>
          </p>
        </section>
        <section className="footer">
          <div className="icon-container">
            <button
              type="button"
              className="icon"
              onClick={() => handleEditFood(props.food)}
              data-testid={`edit-food-${props.food.id}`}
            >
              <FiEdit3 size={20} />
            </button>

            <button
              type="button"
              className="icon"
              onClick={() => handleDelete(props.food.id)}
              data-testid={`remove-food-${props.food.id}`}
            >
              <FiTrash size={20} />
            </button>
          </div>

          <div className="availability-container">
            <p>{state.isAvailable ? 'Disponível' : 'Indisponível'}</p>

            <label htmlFor={`available-switch-${props.food.id}`} className="switch">
              <input
                id={`available-switch-${props.food.id}`}
                type="checkbox"
                checked={state.isAvailable}
                onChange={toggleAvailable}
                data-testid={`change-status-food-${props.food.id}`}
              />
              <span className="slider" />
            </label>
          </div>
        </section>
      </Container>
    );
};
