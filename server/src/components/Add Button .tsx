```jsx
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

// TypeScript type for props
interface AddButtonProps {
  onAddToCart: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onAddToCart }) => {
  // State to manage button color
  const [isAdded, setIsAdded] = useState(false);

  // Function to handle button click
  const handleClick = () => {
    if (!isAdded) {
      // Call the passed in onAddToCart function
      onAddToCart();
      // Change button color to indicate added status
      setIsAdded(true);
    } else {
      // Handle error: Item already added to cart
      alert('Item already added to cart');
    }
  }

  return (
    <Button 
      variant="contained" 
      color={isAdded ? "secondary" : "primary"} 
      onClick={handleClick}
      startIcon={<AddShoppingCartIcon />}
    >
      Add to Cart
    </Button>
  );
}

export default AddButton;
```