import PropsCollage from "./PropsCollage";
import Section from "./Section";

export default function PropsSection() {
  return (
    <Section
      id="props"
      eyebrow="Кухня"
      title="Наш реквизит"
      lead="То, что валяется у нас по сумкам. Можно разгрести руками."
    >
      <PropsCollage />
    </Section>
  );
}
