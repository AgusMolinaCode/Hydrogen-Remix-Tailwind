import {Button} from './Button';
import {FeaturedSection} from './FeaturedSection';
import {PageHeader, Text} from './Text';

export function GenericError({
  error,
}: {
  error?: {message: string; stack?: string};
}) {
  const heading = `Hubo un error al cargar esta página.`;
  let description = `Por favor, intenta recargar la página.`;

  // TODO hide error in prod?
  if (error) {
    description += `\n${error.message}`;
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return (
    <>
      <PageHeader heading={heading}>
        <Text width="narrow" as="p">
          {description}
        </Text>
        {error?.stack && (
          <pre
            style={{
              padding: '2rem',
              background: 'hsla(10, 50%, 50%, 0.1)',
              color: 'red',
              overflow: 'auto',
              maxWidth: '100%',
            }}
            dangerouslySetInnerHTML={{
              __html: addLinksToStackTrace(error.stack),
            }}
          />
        )}
        <Button width="auto" variant="secondary" to={'/'}>
          Home
        </Button>
      </PageHeader>
      <FeaturedSection />
    </>
  );
}

function addLinksToStackTrace(stackTrace: string) {
  return stackTrace?.replace(
    /^\s*at\s?.*?[(\s]((\/|\w\:).+)\)\n/gim,
    (all, m1) =>
      all.replace(
        m1,
        `<a href="vscode://file${m1}" class="hover:underline">${m1}</a>`,
      ),
  );
}
