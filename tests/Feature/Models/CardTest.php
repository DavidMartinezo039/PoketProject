<?php

namespace Tests\Feature\Models;

use App\Models\Card;
use App\Models\Set;
use App\Models\Supertype;
use App\Models\Rarity;
use App\Models\Type;
use App\Models\Subtype;
use App\Models\User;
use App\Models\UserSet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CardTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_belongs_to_a_set()
    {
        $set = Set::factory()->create();
        $card = Card::factory()->create(['set_id' => $set->id]);

        $this->assertInstanceOf(Set::class, $card->set);
        $this->assertEquals($set->id, $card->set->id);
    }

    /** @test */
    public function it_belongs_to_a_supertype()
    {
        $supertype = Supertype::factory()->create();
        $card = Card::factory()->create(['supertype_id' => $supertype->id]);

        $this->assertInstanceOf(Supertype::class, $card->supertype);
        $this->assertEquals($supertype->id, $card->supertype->id);
    }

    /** @test */
    public function it_belongs_to_a_rarity()
    {
        $rarity = Rarity::factory()->create();
        $card = Card::factory()->create(['rarity_id' => $rarity->id]);

        $this->assertInstanceOf(Rarity::class, $card->rarity);
        $this->assertEquals($rarity->id, $card->rarity->id);
    }

    /** @test */
    public function it_belongs_to_many_types()
    {
        $card = Card::factory()->create();
        $types = Type::factory(3)->create();

        $card->types()->attach($types);

        $this->assertCount(3, $card->types);
        $this->assertTrue($card->types->contains($types->first()));
    }

    /** @test */
    public function it_belongs_to_many_subtypes()
    {
        $card = Card::factory()->create();
        $subtypes = Subtype::factory(2)->create();

        $card->subtypes()->attach($subtypes);

        $this->assertCount(2, $card->subtypes);
        $this->assertTrue($card->subtypes->contains($subtypes->first()));
    }

    /** @test */
    public function it_handles_empty_types_and_subtypes()
    {
        $card = Card::factory()->create();

        $this->assertCount(0, $card->types);
        $this->assertCount(0, $card->subtypes);
    }

    /** @test */
    public function deleting_a_card_does_not_affect_related_sets_or_supertypes()
    {
        $set = Set::factory()->create();
        $supertype = Supertype::factory()->create();
        $card = Card::factory()->create(['set_id' => $set->id, 'supertype_id' => $supertype->id]);

        $card->delete();

        $this->assertDatabaseHas('sets', ['id' => $set->id]);
        $this->assertDatabaseHas('supertypes', ['id' => $supertype->id]);
    }

    /** @test */
    public function it_belongs_to_many_user_sets()
    {
        // Crea un usuario y un UserSet
        $user = User::factory()->create();
        $userSet = UserSet::factory()->create(['user_id' => $user->id]);

        // Crea una carta y asocia esa carta con el UserSet
        $card = Card::factory()->create();
        $userSet->cards()->attach($card);

        // Verifica que la carta esté asociada al UserSet
        $this->assertCount(1, $userSet->cards);
        $this->assertTrue($userSet->cards->contains($card));

        // Verifica que la carta también pertenezca al UserSet correspondiente
        $this->assertTrue($card->userSets->contains($userSet));
    }

    /** @test */
    public function it_associates_a_card_to_a_user_set()
    {
        // Crear un userSet
        $userSet = UserSet::factory()->create();

        // Crear una carta
        $card = Card::factory()->create();

        // Asociar la carta al userSet
        $userSet->cards()->attach($card);

        // Comprobar que la carta está asociada correctamente al userSet
        $this->assertTrue($userSet->cards->contains($card));

        // Comprobar que el número de cartas en el userSet es 1
        $this->assertEquals(1, $userSet->cards()->count());
    }
}
