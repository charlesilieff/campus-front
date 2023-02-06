import { Box, Button, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import axios from 'axios'
import { Option as O } from 'effect'
import React, { useEffect, useState } from 'react'
import { BsFillExclamationCircleFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'

interface ReservationToBeProcessed {
  total: number
  urgent: number
}

export const ReservationsToBeProcessed = () => {
  const [reservationToBeProcessed, setReservationToBeProcessed] = useState<
    O.Option<ReservationToBeProcessed>
  >(O.none)

  useEffect(() => {
    const fetchReservationsToBeProcessed = async () => {
      const requestUrl = 'api/reservation-to-be-processed-count'
      return (await axios.get<ReservationToBeProcessed>(requestUrl)).data
    }
    fetchReservationsToBeProcessed().then(response => setReservationToBeProcessed(O.some(response)))
  }, [])

  return (
    <>
      {O.isSome(reservationToBeProcessed) ?
        (
          <VStack>
            {reservationToBeProcessed.value.urgent > 0 ?
              (
                <Box
                  py={'10px'}
                  px={'25px'}
                  backgroundColor={'#FED7D7'}
                  borderLeft={'4px'}
                  borderColor={'#E53E3E'}
                  minW={'650px'}
                >
                  <HStack justifyContent={'space-between'}>
                    <VStack alignItems={'flex-start'}>
                      <HStack>
                        <BsFillExclamationCircleFill color="#E53E3E" size={'24px'} />
                        <Text fontWeight={'bold'}>Réservations urgentes</Text>
                      </HStack>
                      <Text>
                        Vous avez {reservationToBeProcessed.value.urgent}{' '}
                        réservations urgentes à traiter
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ) :
              null}
            {reservationToBeProcessed.value.total > 0 ?
              (
                <Box
                  py={'10px'}
                  px={'25px'}
                  backgroundColor={'#BEE3F8'}
                  borderLeft={'4px'}
                  borderColor={'#3182CE'}
                  minW={'650px'}
                >
                  <HStack justifyContent={'space-between'}>
                    <VStack alignItems={'flex-start'}>
                      <HStack>
                        <BsFillExclamationCircleFill color="#3182CE" size={'24px'} />
                        <Text fontWeight={'bold'}>Réservations non traitées</Text>
                      </HStack>
                      <Text>
                        Vous avez {reservationToBeProcessed.value.total} réservations à traiter
                      </Text>
                    </VStack>
                    <Button
                      color={'white'}
                      backgroundColor={'#3182CE'}
                      as={Link}
                      to="/reservation/to-be-processed"
                      _hover={{ textDecoration: 'none', color: 'white' }}
                    >
                      Traiter les réservations
                    </Button>
                  </HStack>
                </Box>
              ) :
              null}
          </VStack>
        ) :
        <Spinner />}
    </>
  )
}
