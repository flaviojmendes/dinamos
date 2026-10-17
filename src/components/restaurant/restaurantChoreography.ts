import type { LessonVisual } from './visualModel';

export type RestaurantAction = 'handover' | 'queue' | 'read' | 'write' | 'copy' | 'approve' | 'hold' | 'compare' | 'return' | 'refund' | 'retry' | 'file-duplicate' | 'sort' | 'add-staff';
export interface RestaurantBeat {
  action: RestaurantAction;
  copies: 1 | 2 | 3;
  carry: boolean;
  stamp?: 'approved' | 'rejected' | 'refunded';
}

/** Choreography names restaurant work, rather than displaying generic data traffic. */
export function getRestaurantBeat(visual: LessonVisual): RestaurantBeat {
  switch (visual.cue) {
    case 'queue': return { action: 'queue', copies: 1, carry: false };
    case 'cache-hit': case 'retrieve': case 'answer': case 'inspect':
      return { action: 'read', copies: 1, carry: false };
    case 'write': return { action: 'write', copies: 1, carry: false };
    case 'cache-fill': case 'replicate': return { action: 'copy', copies: visual.peers ? 3 : 2, carry: true };
    case 'vote': return { action: 'approve', copies: visual.peers ? 3 : 1, carry: false };
    case 'commit': return { action: 'approve', copies: 1, carry: false, stamp: 'approved' };
    case 'partition': case 'wait': return { action: 'hold', copies: 1, carry: visual.from !== visual.to };
    case 'stale-read': return { action: 'read', copies: 1, carry: false };
    case 'merge': return { action: 'compare', copies: 2, carry: false };
    case 'reject': return { action: 'return', copies: 1, carry: true, stamp: 'rejected' };
    case 'compensate': return { action: 'refund', copies: 2, carry: true, stamp: 'refunded' };
    case 'retry': return { action: 'retry', copies: 2, carry: true };
    case 'deduplicate': return { action: 'file-duplicate', copies: 2, carry: true, stamp: 'approved' };
    case 'filter': return { action: 'sort', copies: 3, carry: false };
    case 'scale': return { action: 'add-staff', copies: 1, carry: false };
    default: return { action: 'handover', copies: 1, carry: visual.from !== visual.to };
  }
}

export const restaurantActionNames: Record<'pt' | 'en', Record<RestaurantAction, string>> = {
  pt: { handover: 'Passar para a próxima estação', queue: 'Aguardar a vez', read: 'Consultar e conferir', write: 'Anotar no registro', copy: 'Distribuir cópias', approve: 'Conferir a decisão', hold: 'Manter em espera', compare: 'Comparar os registros', return: 'Devolver sem executar', refund: 'Estornar e liberar a reserva', retry: 'Reenviar a mesma comanda', 'file-duplicate': 'Arquivar a via repetida', sort: 'Separar as fichas permitidas', 'add-staff': 'Ampliar a capacidade' },
  en: { handover: 'Hand over to the next station', queue: 'Wait for a turn', read: 'Look up and check', write: 'Write in the record', copy: 'Distribute copies', approve: 'Check the decision', hold: 'Keep waiting', compare: 'Compare the records', return: 'Return without executing', refund: 'Refund and release the reservation', retry: 'Resend the same order ticket', 'file-duplicate': 'File the repeated copy', sort: 'Separate permitted cards', 'add-staff': 'Increase capacity' },
};
