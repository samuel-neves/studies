import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProviderListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
} from './styles';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { goBack } = useNavigation();

  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  const handleGoBackButton = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback(
    providerId => {
      setSelectedProvider(providerId);
    },
    [goBack],
  );

  return (
    <Container>
      <Header>
        <BackButton onPress={handleGoBackButton}>
          <Icon name="chevron-left" size={24} color="#999591" />

          <HeaderTitle>Cabeleireiros</HeaderTitle>
        </BackButton>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <ProviderListContainer>
        <ProvidersList
          data={providers}
          keyExtractor={provider => provider.id}
          horizontal
          contentContainerStyle={{ paddingRight: 32 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              onPress={() => handleSelectProvider(provider.id)}
              selected={provider.id === selectedProvider}
            >
              <ProviderAvatar source={{ uri: provider.avatar_url }} />
              <ProviderName selected={provider.id === selectedProvider}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProviderListContainer>
    </Container>
  );
};

export default Dashboard;
