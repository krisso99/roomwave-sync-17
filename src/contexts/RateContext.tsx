
// This file is kept for backwards compatibility,
// it re-exports everything from the refactored structure
import { RateProvider, useRates } from './rate/RateProvider';
import type {
  RateType,
  DayOfWeek,
  DiscountType,
  PromotionStatus,
  RateRule,
  SeasonalRate,
  SpecialEventRate,
  Promotion,
  ChannelRateMapping,
  RateChangeLog,
  RoomType,
  Channel,
  RateContextType
} from './rate/types';

export { RateProvider, useRates };
export type {
  RateType,
  DayOfWeek,
  DiscountType,
  PromotionStatus,
  RateRule,
  SeasonalRate,
  SpecialEventRate,
  Promotion,
  ChannelRateMapping,
  RateChangeLog,
  RoomType,
  Channel,
  RateContextType
};
