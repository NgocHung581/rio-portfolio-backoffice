<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Concerns\Media\HasRelations;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasRelations;

    protected $table = 'media';

    protected $primaryKey = 'id';


    protected $fillable = [
        'type',
        'file_path',
        'file_name',
        'file_size',
        'mediaable_id',
        'mediaable_type',
    ];
}
