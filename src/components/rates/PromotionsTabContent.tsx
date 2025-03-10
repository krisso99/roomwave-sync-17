
import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit } from 'lucide-react';
import { Promotion } from '@/contexts/RateContext';

interface PromotionsTabContentProps {
  promotions: Promotion[];
  onEditPromotion: (promotion: Promotion | null) => void;
}

const PromotionsTabContent: React.FC<PromotionsTabContentProps> = ({
  promotions,
  onEditPromotion,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Promotions</CardTitle>
          <CardDescription>
            Manage special offers and discounts
          </CardDescription>
        </div>
        <Button onClick={() => onEditPromotion(null)}>
          <Plus className="mr-2 h-4 w-4" />
          New Promotion
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map(promotion => (
            <Card key={promotion.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{promotion.name}</CardTitle>
                  <Badge variant={
                    promotion.status === 'active' ? 'default' :
                    promotion.status === 'scheduled' ? 'outline' :
                    promotion.status === 'expired' ? 'secondary' :
                    'destructive'
                  }>
                    {promotion.status.charAt(0).toUpperCase() + promotion.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription>
                  {promotion.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="font-medium">
                      {promotion.discountType === 'percentage' ? 
                        `${promotion.discountValue}%` : 
                        `$${promotion.discountValue.toFixed(2)}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Valid Until:</span>
                    <span>{format(new Date(promotion.endDate), 'PP')}</span>
                  </div>
                  {promotion.minimumStay && (
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Min Stay:</span>
                      <span>{promotion.minimumStay} nights</span>
                    </div>
                  )}
                  {promotion.promoCode && (
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Promo Code:</span>
                      <span className="font-mono">{promotion.promoCode}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usage:</span>
                    <span>{promotion.currentUsage} / {promotion.maxUsage || '∞'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t bg-muted/20 py-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditPromotion(promotion)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionsTabContent;
