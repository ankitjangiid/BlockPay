import { useEffect, useState } from 'react'
import axios from 'axios';
import { useSearchParams } from 'react-router-dom'
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Text, VStack } from '@chakra-ui/react';
const PaymentPage = () => {
    const searchQuery = useSearchParams()[0];
    const  applicationNo  = searchQuery.get("applicationNo");
    const [data, setData] = useState({});
    const [userDetails, setUserDetails] = useState({
      applicationNo: "",
      name: "",
      dob: "",
      fatherName: "",
      course: "",
      courseSession: "",
      courseYear: "",
      amount: 0,
      instituteName: "",
      email: "",
      phone: "",
    });
    useEffect(() => {
      const fetchDetails = async () => {
      await axios
        .post("http://localhost:4000/api/details", {
          applicationNo
        }).then((res)=> {
          console.log(res.data.userData);
          setData(res.data.userData);
          userDetails.applicationNo = res.data.userData.form.applicationNo;
          userDetails.name = res.data.userData.form.name;
          userDetails.dob = res.data.userData.form.dob;
          userDetails.fatherName = res.data.userData.form.fatherName;
          userDetails.course = res.data.userData.form.course;
          userDetails.courseSession = res.data.userData.form.courseSession;
          userDetails.courseYear = res.data.userData.form.courseYear;
          userDetails.amount = res.data.userData.form.amount;
          userDetails.instituteName = res.data.userData.instituteName;
          userDetails.email = res.data.userData.email;
          userDetails.phone = res.data.userData.phoneNo;
        })
        console.log(userDetails);
    }
      fetchDetails();
      },[applicationNo,userDetails]);
      const amount = userDetails.amount;
    const checkoutHandler = async () => {

        const { data: { key } } = await axios.get("http://www.localhost:4000/api/getkey")

        const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", {
           amount,applicationNo
        })
        console.log(order)
        const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: userDetails.instituteName,
            description: "Academic Fee Transaction",
            image: "https://cdn0.iconfinder.com/data/icons/handsome-man-avatars/283/stock_man_avatar-04-512.png",
            order_id: order.id,
            callback_url: `http://localhost:4000/api/paymentverification?applicationNo=${applicationNo}&amount=${amount}`,
            prefill: {
                name: userDetails.name,
                email: userDetails.email,
                contact: userDetails.phone,
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#3399cc"
            }
        };
        // console.log(options)
        const razor = new window.Razorpay(options);
        razor.open();
    }
  return (       
          <Box>
            <Card width='full' height='100vh' align='center'>
              <CardHeader>
                <Heading color='black'>{userDetails.instituteName}</Heading>
              </CardHeader>
              <Card width='50%' height='full' align='center' bg='gray.100' borderRadius='3em' padding='2.5em' boxShadow='0 0.188em 1.550em rgb(156, 156, 156)'>
                <Flex padding='0.3em'><Text color='gray' fontSize='3xl' as='b' gap='2' marginBottom='2'>Application No: {userDetails.applicationNo}</Text></Flex>
                <Flex padding='0.3em'><Text color='gray' fontSize='3xl' as='b' gap='2' marginBottom='2'>Name: {userDetails.name}</Text></Flex>
                <Flex padding='0.3em'><Text color='gray' fontSize='3xl' as='b' gap='2' marginBottom='2'>DOB: {userDetails.dob}</Text></Flex>
                <Flex padding='0.3em'><Text color='gray' fontSize='3xl' as='b' gap='2' marginBottom='2'>Father Name: {userDetails.fatherName}</Text></Flex>
                <Flex padding='0.3em'><Text color='gray' fontSize='3xl' as='b' gap='2' marginBottom='2'>Course: {userDetails.course}</Text></Flex>
                <Flex padding='0.3em'><Text color='gray' fontSize='3xl' as='b' gap='2' marginBottom='2'>Course Session: {userDetails.courseSession}</Text></Flex>
                <Flex padding='0.3em'><Text color='gray' fontSize='3xl' as='b' gap='2' marginBottom='2'>Course Year: {userDetails.courseYear}</Text></Flex>
                <Flex padding='0.3em'><Text color='gray' fontSize='3xl' as='b' gap='2' marginBottom='2'>Amount: {userDetails.amount}</Text></Flex>
              </Card>
              <CardFooter>
                <Button colorScheme='blue' onClick={checkoutHandler}>
                  Pay Now
                </Button>
              </CardFooter>
            </Card>
          </Box>

  )
}

export default PaymentPage