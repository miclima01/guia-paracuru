-- Update premium price from 9.90 to 1.99
UPDATE app_settings 
SET value = '1.99' 
WHERE key = 'premium_price';

-- Verify the update
SELECT * FROM app_settings WHERE key = 'premium_price';
