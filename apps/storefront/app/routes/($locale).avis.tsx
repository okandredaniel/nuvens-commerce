import {
  Badge,
  Button,
  Card,
  CardContent,
  Container,
  Heading,
  RatingStars,
  ReviewCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  trustpilotLogo,
} from '@nuvens/ui';
import { Image } from '@shopify/hydrogen';
import { Award, Filter, Star, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ReviewsPage() {
  const { i18n } = useTranslation('home');

  const reviews = [
    {
      id: 1,
      name: 'Marie Dubois',
      rating: 5,
      date: '2024-01-15',
      text: 'Excellent produit ! La qualité est au rendez-vous et le service client est très réactif. Je recommande vivement Zippex.',
      verified: true,
    },
    {
      id: 2,
      name: 'Pierre Martin',
      rating: 5,
      date: '2024-01-12',
      text: 'Très satisfait de mon achat. La livraison a été rapide et le produit correspond parfaitement à mes attentes.',
      verified: true,
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      rating: 4,
      date: '2024-01-10',
      text: "Bon produit dans l'ensemble. Quelques petits détails à améliorer mais je suis globalement contente de mon achat.",
      verified: true,
    },
    {
      id: 4,
      name: 'Thomas Bernard',
      rating: 5,
      date: '2024-01-08',
      text: "Service impeccable ! L'équipe Zippex a su répondre à toutes mes questions et m'a accompagné dans mon choix.",
      verified: true,
    },
    {
      id: 5,
      name: 'Julie Moreau',
      rating: 5,
      date: '2024-01-05',
      text: 'Je recommande les yeux fermés ! Qualité premium et prix très compétitif. Zippex a su me convaincre.',
      verified: true,
    },
    {
      id: 6,
      name: 'Antoine Rousseau',
      rating: 4,
      date: '2024-01-03',
      text: 'Très bon rapport qualité-prix. Le produit est solide et bien fini. Livraison dans les temps.',
      verified: true,
    },
  ];

  const stats = {
    averageRating: 4.8,
    totalReviews: 1247,
    fiveStars: 89,
    fourStars: 8,
    threeStars: 2,
    twoStars: 1,
    oneStar: 0,
  };

  return (
    <main className="bg-neutral-0">
      <section className="bg-primary-600 py-24">
        <Container>
          <div className="space-y-6 text-center">
            <Badge variant="outline" className="text-white/70">
              Ce que disent nos clients
            </Badge>
            <Heading as="h1" className="text-4xl md:text-5xl text-white" align="center">
              Avis clients Zippex
            </Heading>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-neutral-100">
              Découvrez ce que nos clients pensent de nos produits et services
            </p>
            <div className="space-x-6">
              <Button variant="white">Voir tous les avis</Button>
              <Button variant="primary">Partagez votre expérience</Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-neutral-200 bg-neutral-0 p-6">
              <CardContent className="p-0 text-center">
                <div className="mx-auto mb-2 flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-neutral-900">{stats.averageRating}</span>
                  <Star className="h-6 w-6 fill-accent-600 text-accent-600" aria-hidden />
                </div>
                <p className="text-sm text-neutral-600">Note moyenne</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <RatingStars value={5} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 bg-neutral-0 p-6">
              <CardContent className="p-0 text-center">
                <Users className="mx-auto mb-2 h-8 w-8 text-accent-600" aria-hidden />
                <span className="text-3xl font-bold text-neutral-900">
                  {stats.totalReviews.toLocaleString()}
                </span>
                <p className="text-sm text-neutral-600">Avis clients</p>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 bg-neutral-0 p-6">
              <CardContent className="p-0 text-center">
                <Award className="mx-auto mb-2 h-8 w-8 text-accent-600" aria-hidden />
                <span className="text-3xl font-bold text-neutral-900">{stats.fiveStars}%</span>
                <p className="text-sm text-neutral-600">Avis 5 étoiles</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-neutral-500" aria-hidden />
              <span className="text-sm font-medium text-neutral-900">Filtrer par</span>
            </div>

            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <Select defaultValue="all">
                <SelectTrigger placeholder="Selecione uma opção" />
                <SelectContent>
                  <SelectItem value="all">Toutes les notes</SelectItem>
                  <SelectItem value="5">5 étoiles</SelectItem>
                  <SelectItem value="4">4 étoiles</SelectItem>
                  <SelectItem value="3">3 étoiles</SelectItem>
                  <SelectItem value="2">2 étoiles</SelectItem>
                  <SelectItem value="1">1 étoile</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="recent">
                <SelectTrigger placeholder="Date" />
                <SelectContent>
                  <SelectItem value="recent">Plus récents</SelectItem>
                  <SelectItem value="oldest">Plus anciens</SelectItem>
                  <SelectItem value="helpful">Plus utiles</SelectItem>
                </SelectContent>
              </Select>

              <div className="w-full flex justify-end">
                <Button variant="outline">Réinitialiser</Button>
              </div>
            </div>
          </div>

          <Card className="mb-8 border-neutral-200 bg-neutral-0">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">Répartition des notes</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const percentage =
                    stars === 5
                      ? stats.fiveStars
                      : stars === 4
                        ? stats.fourStars
                        : stars === 3
                          ? stats.threeStars
                          : stars === 2
                            ? stats.twoStars
                            : stats.oneStar;
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <div className="flex w-20 items-center gap-1">
                        <span className="text-sm text-neutral-900">{stars}</span>
                        <Star className="h-3 w-3 fill-accent-600 text-accent-600" aria-hidden />
                      </div>
                      <div className="h-2 flex-1 rounded-full bg-neutral-200">
                        <div
                          className="h-2 rounded-full bg-accent-600 transition-[width] duration-300"
                          style={{ width: `${percentage}%` }}
                          aria-hidden
                        />
                      </div>
                      <span className="w-12 text-right text-sm text-neutral-600">
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                name={review.name}
                text={review.text}
                rating={review.rating}
                ratingLabel={`${review.rating}/5`}
                Image={Image}
                logoSrc={trustpilotLogo}
                verified={review.verified}
                verifiedLabel="Verified"
                date={
                  review.date ? new Date(review.date).toLocaleDateString(i18n.language) : undefined
                }
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="bg-transparent px-8">
              <TrendingUp className="mr-2 h-4 w-4 text-primary-700" aria-hidden />
              Voir plus d&apos;avis
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
