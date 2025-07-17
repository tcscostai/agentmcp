```jsx
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

// TypeScript types
interface AddToCartButtonProps {
  initialQuantity?: number;
  onAddToCart: (quantity: number) => void;
}

// React component
const AddToCartButton: React.FC<AddToCartButtonProps> = ({ initialQuantity = 1, onAddToCart }) => {
  // Local state for quantity
  const [quantity, setQuantity] = useState(initialQuantity);
  // Local state for added to cart status
  const [added, setAdded] = useState(false);

  // Function to handle quantity change
  const handleQuantityChange = (change: number) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + change));
  };

  // Function to handle add to cart button click
  const handleAddToCart = () => {
    onAddToCart(quantity);
    setAdded(true);
  };

  return (
    <div>
      <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity === 1}>
        <RemoveIcon />
      </IconButton>
      {quantity}
      <IconButton onClick={() => handleQuantityChange(1)}>
        <AddIcon />
      </IconButton>
      <Button variant="contained" color={added ? "secondary" : "primary"} onClick={handleAddToCart} startIcon={<AddShoppingCartIcon />}>
        {added ? "Added to Cart" : "Add to Cart"}
      </Button>
    </div>
  );
};

export default AddToCartButton;
```