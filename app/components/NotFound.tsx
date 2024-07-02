import {Button} from './Button';
import {FeaturedSection} from './FeaturedSection';
import {PageHeader, Text} from './Text';

export function NotFound({type = 'page'}: {type?: string}) {
  const heading = `Perdimos la ${type}`;
  const description = `No pudimos encontrar la ${type} que buscas. Por favor, verifica la URL e intenta nuevamente.`;

  return (
    <>
      <PageHeader heading={heading}>
        <Text width="narrow" as="p">
          {description}
        </Text>
        <Button width="auto" variant="secondary" to={'/'}>
          Pagina principal
        </Button>
      </PageHeader>
      <FeaturedSection />
    </>
  );
}
