<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Contracts\Validation\Validator;

/**
 * The trait for replacing index with key in errors.
 * - Only used in `FormRequest` class.
 */
trait ReplaceIndexWithKeyInErrors
{
    protected function replaceIndexWithKey(Validator $validator): void
    {
        $errors = $validator->errors();
        $data = $this->all();

        foreach ($errors->getMessages() as $attribute => $messages) {
            $segments = explode('.', $attribute);
            $currentData = $data;
            $rebuiltPath = [];
            $shouldChange = false;

            foreach ($segments as $segment) {
                if (is_numeric($segment) && is_array($currentData) && isset($currentData[$segment])) {
                    $item = $currentData[$segment];

                    if (is_array($item) && isset($item['key'])) {
                        $rebuiltPath[] = $item['key'];
                        $shouldChange = true;
                    } else {
                        $rebuiltPath[] = $segment;
                    }

                    $currentData = $item;
                } else {
                    $rebuiltPath[] = $segment;
                    $currentData = is_array($currentData) && isset($currentData[$segment])
                        ? $currentData[$segment]
                        : null;
                }
            }

            // Skip if no change.
            if (!$shouldChange) {
                continue;
            }

            $newKey = implode('.', $rebuiltPath);

            // Add new key.
            foreach ($messages as $message) {
                $errors->add($newKey, $message);
            }

            // Delete old key.
            $errors->forget($attribute);
        }
    }
}
