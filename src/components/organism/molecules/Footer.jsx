import Text from "@/components/atoms/Text";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full px-24 md:px-48 lg:px-64 py-24 border-t border-border/30 mt-32">
      <div className="max-w-[900px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        <div className="flex flex-col gap-2">
          <Text className="text-xl font-black lowercase tracking-tighter text-foreground">
            dhaafin<span className="text-accent">.</span>
          </Text>
          <Text className="text-xs uppercase tracking-[0.2em] font-medium text-muted/50">
            © {new Date().getFullYear()}
          </Text>
        </div>

        <div className="flex gap-8">
          {['github', 'linkedin', 'twitter'].map((platform) => (
            <Link 
              key={platform} 
              href={`#${platform}`} 
              className="text-xs uppercase tracking-[0.2em] font-bold text-muted hover:text-foreground transition-colors duration-500"
            >
              {platform}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
