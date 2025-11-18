import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface Alert {
  id: string;
  user_id: string;
  keywords: string[];
  subreddits: string[];
  active: boolean;
  trigger_mode: 'single' | 'recurring';
  created_at: string;
  updated_at: string;
}

export interface CreateAlertInput {
  keywords: string[];
  subreddits: string[];
  active?: boolean;
  trigger_mode?: 'single' | 'recurring';
}

export interface UpdateAlertInput {
  keywords?: string[];
  subreddits?: string[];
  active?: boolean;
  trigger_mode?: 'single' | 'recurring';
}

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data } = await axios.get('/api/alerts');
      return data.alerts as Alert[];
    },
  });
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: ['alerts', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/alerts/${id}`);
      return data.alert as Alert;
    },
    enabled: !!id,
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAlertInput) => {
      const { data } = await axios.post('/api/alerts', input);
      return data.alert as Alert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useUpdateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateAlertInput }) => {
      const { data } = await axios.patch(`/api/alerts/${id}`, input);
      return data.alert as Alert;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts', variables.id] });
    },
  });
}

export function useDeleteAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/alerts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}
