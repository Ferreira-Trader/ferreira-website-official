import { useEffect } from 'react';

export const useCampaignId = (campaignId: string) => {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'page_campaign_id': campaignId
    });
  }, [campaignId]);
};
