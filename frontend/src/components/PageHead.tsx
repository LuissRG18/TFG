import { Helmet } from 'react-helmet-async';

interface Props {
  /** Título corto de la página. Se compone como "{titulo} · SciLens". */
  titulo: string;
  /** Descripción meta (150–160 caracteres ideal) para Google y redes sociales. */
  descripcion?: string;
  /** Si true, pide a los buscadores que NO indexen la página (privadas). */
  noIndex?: boolean;
}

const DESC_DEFECTO =
  'SciLens centraliza el acceso a más de 2 millones de artículos científicos de arXiv, CrossRef y OpenAlex en una sola interfaz.';

const PageHead = ({ titulo, descripcion = DESC_DEFECTO, noIndex = false }: Props) => {
  const tituloCompleto = `${titulo} · SciLens`;
  return (
    <Helmet>
      <title>{tituloCompleto}</title>
      <meta name="description" content={descripcion} />
      <meta property="og:title" content={tituloCompleto} />
      <meta property="og:description" content={descripcion} />
      <meta name="twitter:title" content={tituloCompleto} />
      <meta name="twitter:description" content={descripcion} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default PageHead;
