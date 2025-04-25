<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'attached_file',
        'assignee_id',
        'due_date_time',
        'started_date',
        'status',
        'created_by',
    ];

    protected $casts = [
        'due_date_time' => 'datetime',
        'started_date' => 'datetime',
    ];

    protected $dateFormat = 'Y-m-d H:i:s';

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }
}