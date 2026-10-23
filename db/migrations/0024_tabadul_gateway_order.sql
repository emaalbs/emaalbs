-- Pin the provider-assigned order number before allowing a real pilot checkout.
ALTER TABLE ibs_tabadul_attempts ADD COLUMN gateway_order_number TEXT;
