import PropsCollage from "./PropsCollage";
import Section from "./Section";

export default function PropsSection() {
  return (
    <Section
      id="props"
      eyebrow="Кухня"
      title="Из чего собирается смена"
      lead="Хлопушка, бобины, плёнка, оптика, мегафон и пушка на удочке. Здесь они лежат как после смены — можно разгрести руками."
    >
      <PropsCollage />
    </Section>
  );
}
