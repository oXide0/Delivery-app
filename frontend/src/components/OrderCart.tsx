import { Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { OrderItem } from '../types';
import { getTotalPrice } from '../helpers/utils';
import OrderProductCard from './OrderProductCard';

interface OrderCartProps {
    items: OrderItem[];
    removeItem: (itemId: string) => void;
    updateItemQuantity: (itemId: string, quantity: number) => void;
}

const OrderCart = ({ items, removeItem, updateItemQuantity }: OrderCartProps) => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box
            bgcolor={theme.palette.background.paper}
            minWidth={400}
            pt={5}
            px={2}
            pb={2}
            display='flex'
            flexDirection='column'
            height='100vh'
        >
            <Typography variant='h5' fontWeight={700}>
                My Order
            </Typography>
            <Box flex='1 1 auto' overflow='auto' my={3}>
                {items.length ? (
                    <Stack gap={2}>
                        {items.map((item) => (
                            <OrderProductCard
                                key={item.product.id}
                                imgUrl={item.product.imgUrl}
                                price={item.product.price}
                                title={item.product.title}
                                quantity={item.quantity}
                                onRemoveFromCart={() => removeItem(item.id)}
                                onUpdateProductQuantity={(quantity) =>
                                    updateItemQuantity(item.id, quantity)
                                }
                            />
                        ))}
                    </Stack>
                ) : (
                    <Typography variant='h6' fontWeight={700} textAlign='center'>
                        No items in your cart
                    </Typography>
                )}
            </Box>
            <Divider sx={{ borderWidth: 2, color: '#000' }} />
            <Stack direction='row' justifyContent='space-between' pt={1}>
                <Typography variant='h6' fontWeight={700}>
                    Total
                </Typography>
                <Typography variant='h6' fontWeight={700}>
                    €{getTotalPrice(items)}
                </Typography>
            </Stack>
            <Button variant='contained' onClick={() => navigate('/cart')} sx={{ mt: 2 }}>
                Check Out
            </Button>
        </Box>
    );
};

export default OrderCart;
