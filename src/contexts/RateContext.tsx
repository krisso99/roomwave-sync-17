
// This file is kept for backwards compatibility,
// it re-exports everything from the refactored structure
import { RateProvider, useRates } from './rate/RateProvider';
import {
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

export {
  RateProvider,
  useRates,
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
