import { Box, Button, Divider, Grid, Stack, Typography, useTheme } from '@mui/material';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import PinField from 'react-pin-field';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, checkUserExists } from '../api/authApi';
import { sendCode, verifyCode } from '../api/emailApi';
import BgFood from '../assets/bg-food.png';
import Input from '../components/Input';
import Wrapper from '../components/layouts/Wrapper';
import { codeValidationSchema, registerValidationSchema } from '../helpers/schemes';
import { formatTime } from '../helpers/utils';

interface SignUpFormValues {
    username: string;
    email: string;
    password: string;
}

interface PinFormValues {
    code: string;
}

const RegisterPage = () => {
    const navigate = useNavigate();
    const [userValues, setUserValues] = useState<SignUpFormValues>();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [timer, setTimer] = useState<number>(600);

    const handleSubmit = async (values: SignUpFormValues) => {
        const userExists = await checkUserExists(values.email);
        if (userExists) {
            setErrorMessage('User already exists');
            return;
        }
        await sendCode(values.email, values.username);
        setUserValues(values);
    };

    const handlePinSubmit = async (values: PinFormValues) => {
        if (!userValues) return;
        try {
            await verifyCode(userValues.email, values.code);
        } catch (error) {
            setErrorMessage('Invalid code');
            return;
        }

        try {
            const { accessToken, userId } = await registerUser(userValues);
            localStorage.setItem('token', accessToken);
            localStorage.setItem('userId', userId);
            navigate('/');
        } catch (error) {
            setErrorMessage('Something went wrong');
        }
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (userValues) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [userValues]);

    return (
        <Wrapper>
            <Grid container height='100vh'>
                <Grid item xs={6} display={{ xs: 'none', sm: 'grid' }}>
                    <img
                        src={BgFood}
                        alt='food'
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box
                        display='flex'
                        flexDirection='column'
                        justifyContent='center'
                        height='100%'
                        p={6}
                    >
                        <Typography variant='h3' textAlign='center' fontWeight={700}>
                            {userValues ? 'Enter the code' : 'Create an account'}
                        </Typography>
                        <Stack my={5}>
                            {errorMessage && (
                                <Typography color='red' fontWeight={600} textAlign='center'>
                                    {errorMessage}
                                </Typography>
                            )}
                            {userValues && (
                                <Typography variant='h6' textAlign='center'>
                                    Confirm your email address
                                </Typography>
                            )}
                            <Divider sx={{ bgcolor: '#000' }} />
                            {userValues && (
                                <Typography variant='body1' textAlign='center' pt={3}>
                                    Time remaining: {formatTime(timer)}
                                </Typography>
                            )}
                        </Stack>
                        {userValues ? (
                            <PinCodeForm onSubmit={handlePinSubmit} />
                        ) : (
                            <SignUpForm onSubmit={handleSubmit} />
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Wrapper>
    );
};

const SignUpForm = ({ onSubmit }: { onSubmit: (values: SignUpFormValues) => void }) => {
    const theme = useTheme();

    return (
        <Formik
            initialValues={{ username: '', email: '', password: '' }}
            onSubmit={(values) => onSubmit(values)}
            validationSchema={registerValidationSchema}
        >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
                <Box component='form' onSubmit={handleSubmit} display='flex' flexDirection='column'>
                    <Stack spacing={2}>
                        <Input
                            name='username'
                            label='Your name'
                            value={values.username}
                            onChange={handleChange}
                            error={touched.username && Boolean(errors.username)}
                            helperText={touched.username && errors.username}
                        />
                        <Input
                            name='email'
                            label='Email Address'
                            type='email'
                            value={values.email}
                            onChange={handleChange}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                        />
                        <Input
                            name='password'
                            label='Password'
                            type='password'
                            value={values.password}
                            onChange={handleChange}
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                        />
                    </Stack>
                    <Button type='submit' sx={{ mt: 5, p: 1 }}>
                        Sign up
                    </Button>
                    <Typography textAlign='center' pt={4}>
                        Already have an account?{' '}
                        <Link
                            to='/login'
                            style={{
                                textDecoration: 'underline',
                                color: theme.palette.primary.main,
                            }}
                        >
                            Login
                        </Link>
                    </Typography>
                </Box>
            )}
        </Formik>
    );
};

const PinCodeForm = ({ onSubmit }: { onSubmit: (value: PinFormValues) => void }) => {
    return (
        <Formik
            initialValues={{ code: '' }}
            onSubmit={(values) => onSubmit(values)}
            validationSchema={codeValidationSchema}
        >
            {({ handleSubmit, setValues, errors, touched }) => (
                <Box component='form' onSubmit={handleSubmit}>
                    <Stack display='flex' flexDirection='row' gap={3}>
                        <PinField
                            onChange={(value) => setValues({ code: value })}
                            name='code'
                            style={{
                                width: '100%',
                                outline: 'none',
                                border: `2px solid #756b5f`,
                                borderRadius: '8px',
                                background: 'none',
                                padding: '10px',
                                color: ' #575050',
                                textAlign: 'center',
                                fontSize: '28px',
                            }}
                            length={6}
                            validate={/^[0-9]{0,6}$/}
                        />
                    </Stack>
                    {touched.code && errors.code && (
                        <Typography pt={2} color='red' textAlign='center'>
                            {errors.code}
                        </Typography>
                    )}
                    <Button type='submit' sx={{ mt: 5, p: 1 }}>
                        Verify
                    </Button>
                </Box>
            )}
        </Formik>
    );
};

export default RegisterPage;
