<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Card extends Model
{
    use HasFactory;

    protected $keyType = 'string'; // Clave primaria es una cadena
    public $incrementing = false; // No es autoincremental

    protected $casts = [
        'images' => 'array',
        'legalities' => 'array',
        'tcgplayer' => 'array',
        'cardmarket' => 'array',
    ];

    protected $fillable = [
        'id',
        'name',
        'supertype_id',
        'level',
        'hp',
        'evolvesFrom',
        'evolvesTo',
        'rules',
        'ancientTrait',
        'abilities',
        'attacks',
        'weaknesses',
        'resistances',
        'retreat_cost',
        'convertedRetreatCost',
        'set_id',
        'number',
        'artist',
        'rarity_id',
        'flavorText',
        'nationalPokedexNumbers',
        'legalities',
        'regulationMark',
        'images',
        'tcgplayer',
        'cardmarket',
    ];

    /**
     * Validación para asegurar que set_id sea válido.
     * Validación para asegurar que supertype_id sea válido.
     * Validación para asegurar que rarity_id sea válido.
     * Aumenta el printedTotal y total del set asociado.
     */

    public function set(): belongsTo
    {
        return $this->belongsTo(Set::class);
    }

    public function supertype(): belongsTo
    {
        return $this->belongsTo(Supertype::class);
    }

    public function rarity(): belongsTo
    {
        return $this->belongsTo(Rarity::class);
    }

    public function types(): belongsToMany
    {
        return $this->belongsToMany(Type::class, 'types_cards', 'card_id', 'type_id');
    }

    public function subtypes(): belongsToMany
    {
        return $this->belongsToMany(Subtype::class, 'subtypes_cards', 'card_id', 'subtype_id');
    }

    public function userSets(): BelongsToMany
    {
        return $this->belongsToMany(UserSet::class, 'user_set_cards', 'card_id', 'user_set_id');
    }
}
