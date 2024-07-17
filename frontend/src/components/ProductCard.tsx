import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';

interface ProductCardProps {
    type?: 'order' | 'product';
    title: string;
    imgUrl: string;
    price: string;
    onAddToCart: () => void;
}

const ProductCard = ({ title, price, imgUrl, type = 'product', onAddToCart }: ProductCardProps) => {
    return (
        <Card sx={{ width: 345, borderRadius: 4 }}>
            {type === 'product' && <CardMedia sx={{ height: 140 }} image={imgUrl} title={title} />}
            <CardContent
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <Typography variant='h5' component='div'>
                    {title}
                </Typography>
                <Typography variant='h6'>€{price}</Typography>
            </CardContent>
            {type === 'product' && (
                <CardActions>
                    <Button size='small' variant='contained' onClick={onAddToCart}>
                        Add to cart
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};

export default ProductCard;
