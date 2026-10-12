"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Code2,
  Database,
  ShoppingBag,
  ExternalLink,
  Mail,
  TrendingUp,
  Cpu,
  Terminal,
  Phone,
  MapPin,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Zap,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

function SpotlightCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: -1000, y: -1000 });
      }}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(550px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.15), transparent 45%)`,
        }}
      />
      {children}
    </div>
  );
}

function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div className="h-full w-full" style={{ transform: "translateZ(25px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

function MagneticButton({ children, className = "", onClick, href }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { width, height, top, left } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Element = href ? "a" : "button";

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.1 }}
    >
      <Element
        ref={ref}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={reset}
        className={className}
      >
        {children}
      </Element>
    </motion.div>
  );
}

function Counter({ from = 0, to, decimals = 0, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionVal = useMotionValue(from);
  const springVal = useSpring(motionVal, { damping: 28, stiffness: 90 });

  useEffect(() => {
    if (inView) {
      motionVal.set(to);
    }
  }, [inView, motionVal, to]);

  useEffect(() => {
    return springVal.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      }
    });
  }, [springVal, decimals, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}
      {from.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const services = [
  {
    icon: <ShoppingBag className="w-8 h-8 text-emerald-400" />,
    title: "Shopify & E-Commerce Engineering",
    deliverables: [
      "Custom Shopify Liquid Architecture",
      "Checkout & Drawer UX Optimization",
      "Custom Theme Modules & Section Builder",
      "Performance Optimization & CRO",
    ],
    tag: "High Revenue",
  },
  {
    icon: <Code2 className="w-8 h-8 text-cyan-400" />,
    title: "Full-Stack Web Development",
    deliverables: [
      "Next.js / React 60fps Web Apps",
      "Modern Supabase & Serverless Stacks",
      "Framer Motion Micro-Interactions",
      "Lighthouse 95+ Core Web Vitals",
    ],
    tag: "Scale & Speed",
  },
  {
    icon: <Database className="w-8 h-8 text-purple-400" />,
    title: "Business Intelligence & Analytics",
    deliverables: [
      "Enterprise Power BI Visual Dashboards",
      "Multi-Source SQL Relational Modeling",
      "Advanced Excel Decision Frameworks",
      "Marketing Funnel & Retention Analysis",
    ],
    tag: "Data Driven",
  },
  {
    icon: <Cpu className="w-8 h-8 text-amber-400" />,
    title: "HRIS & Data Governance Systems",
    deliverables: [
      "Enterprise Data Auditing & Validation",
      "Automated Multi-System Workflows",
      "Relational Architecture (Postgres/MySQL)",
      "HR Platform Enhancements & Fixes",
    ],
    tag: "System Design",
  },
];

const skills = [
  { name: "Power BI", cat: "Analytics", level: "Expert" },
  { name: "Shopify Liquid", cat: "Commerce", level: "Architect" },
  { name: "React / Next.js", cat: "Frontend", level: "Senior" },
  { name: "PostgreSQL", cat: "Database", level: "Advanced" },
  { name: "Python", cat: "Data", level: "Advanced" },
  { name: "Supabase", cat: "Backend", level: "Advanced" },
  { name: "Tailwind CSS", cat: "Styling", level: "Expert" },
  { name: "Excel Modeling", cat: "BI", level: "Master" },
  { name: "Node.js", cat: "Runtime", level: "Proficient" },
  { name: "SQL", cat: "Database", level: "Expert" },
];

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState(
    "System ready. Type or click commands below."
  );

  // Form states
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle");

  // Fetch projects from Supabase dynamically
  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: false });

      if (data && !error) {
        setProjects(data);
      }
    }
    loadProjects();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus("loading");
    try {
      const { error } = await supabase.from("messages").insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
        },
      ]);

      if (error) throw error;
      setFormStatus("success");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setFormStatus("error");
    }
  };

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  const displayedProjects = showAllProjects
    ? filteredProjects
    : filteredProjects.slice(0, 3);

  return (
    <div className="relative min-h-screen bg-[#06080d] text-slate-100 selection:bg-cyan-400 selection:text-black overflow-x-hidden font-sans">
      
      {/* Background Lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-cyan-500/10 rounded-full blur-[160px]"
        />
        <motion.div
          animate={{ scale: [1, 1.25, 1], rotate: [0, -60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 -right-32 w-[38rem] h-[38rem] bg-purple-600/10 rounded-full blur-[180px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
      </div>

      {/* Floating Navigation */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-5xl">
        <div className="flex items-center justify-between px-6 py-3.5 rounded-2xl bg-[#0a0d14]/75 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/90">
          <a href="#" className="flex items-center gap-2.5 font-mono text-sm tracking-wider font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
            <span>ASHRAF</span>
            <span className="text-slate-500 font-normal">/ STUDIO</span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-slate-400">
            {["About", "Services", "Projects", "Stack"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-cyan-400 transition-colors duration-200 relative py-1 group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <MagneticButton
            href="#contact"
            className="flex items-center gap-2 text-xs font-mono font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>LET'S TALK</span>
          </MagneticButton>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-44 pb-24 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8 hover:border-cyan-500/40 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-mono tracking-wider text-slate-300 uppercase">
            Available for New Ventures & Retainers
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white max-w-5xl leading-[1.05]"
        >
          Design. Data.{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
            Engineering.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-8 text-base md:text-xl text-slate-400 max-w-2xl leading-relaxed"
        >
          Business Information Systems graduate bridging data analysis, bespoke Shopify architectures, and reactive full-stack web applications.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <MagneticButton
            href="#projects"
            className="group flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-cyan-300 transition-all shadow-xl shadow-white/5"
          >
            <span>Explore Works ({projects.length})</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </MagneticButton>

          <MagneticButton
            href="https://wa.me/201024647816"
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-sm hover:bg-emerald-500/25 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </MagneticButton>
        </motion.div>

        {/* Interactive Terminal Strip */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 w-full max-w-3xl rounded-2xl bg-[#0a0d16]/90 border border-white/10 shadow-2xl backdrop-blur-2xl text-left overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/70 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/70 inline-block" />
              <span className="ml-3 font-mono text-xs text-slate-400">ashraf@interactive-deck:~</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE REPL</span>
            </div>
          </div>

          <div className="p-5 font-mono text-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-cyan-400">guest@portfolio:~$</span>
              <span className="text-white">select mode</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                {
                  label: "run stats()",
                  out: "BIS Grad (AASTMT, GPA 3.6) • 10+ Satisfied Clients • Rapid Turnaround Architecture",
                },
                {
                  label: "run core_stack()",
                  out: "Shopify Liquid • Next.js • React • PostgreSQL • Power BI",
                },
                {
                  label: "run contact_info()",
                  out: "mohamedashrafalsawyy@gmail.com",
                },
              ].map((cmd) => (
                <button
                  key={cmd.label}
                  onClick={() => setTerminalOutput(cmd.out)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
                >
                  {cmd.label}
                </button>
              ))}
            </div>

            <div className="p-3 mt-3 rounded-lg bg-black/40 border border-white/5 text-slate-300 font-mono text-xs">
              <span className="text-emerald-400">Output:</span> {terminalOutput}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Metrics Bar */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-black text-cyan-400 font-mono tracking-tight">
              <Counter from={0} to={2} decimals={0} suffix="+" />
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-widest mt-2 font-mono">
              years of experience
            </div>
          </div>

          <div>
            <div className="text-4xl md:text-5xl font-black text-emerald-400 font-mono tracking-tight">
              <Counter from={0} to={10} decimals={0} suffix="+" />
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-widest mt-2 font-mono">
              Happy Clients
            </div>
          </div>

          <div>
            <div className="text-4xl md:text-5xl font-black text-amber-400 font-mono tracking-tight flex items-center justify-center">
              <Counter from={0} to={14} decimals={0} suffix="Days" />
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-widest mt-2 font-mono">
              Fast Delivery Frame
            </div>
          </div>

          <div>
            <div className="text-4xl md:text-5xl font-black text-indigo-400 font-mono tracking-tight">
              <Counter from={0} to={projects.length || 9} decimals={0} suffix="+" />
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-widest mt-2 font-mono">
              Live Projects Shipped
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-28 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">
              <Terminal className="w-3.5 h-3.5" /> Philosophy
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              Systems designed for conversion, speed, and reliability.
            </h2>
            <p className="mt-6 text-slate-400 leading-relaxed text-sm md:text-base">
              A pure developer often overlooks the balance sheet, and a traditional analyst rarely touches the codebase. My value lies right in the intersection.
            </p>
            <p className="mt-4 text-slate-400 leading-relaxed text-sm md:text-base">
              Having audited enterprise data systems at <strong>Emirates NBD Egypt</strong> and built marketing analytics engines at <strong>H Group</strong>, I deliver high-velocity digital projects with rapid turnaround times.
            </p>
          </div>

          <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: <TrendingUp className="w-6 h-6 text-cyan-400 mb-3" />,
                title: "Analytical Rigor",
                desc: "Enterprise Power BI pipelines, predictive spreadsheets, and validated transactional data.",
              },
              {
                icon: <ShoppingBag className="w-6 h-6 text-emerald-400 mb-3" />,
                title: "Shopify Specialist",
                desc: "Custom Liquid architecture, performance optimization, and high-converting checkout flows.",
              },
              {
                icon: <Code2 className="w-6 h-6 text-purple-400 mb-3" />,
                title: "Modern Frontend",
                desc: "Next.js, React, and tailored CSS crafted for 60fps animations and seamless responsiveness.",
              },
              {
                icon: <Database className="w-6 h-6 text-amber-400 mb-3" />,
                title: "Cloud & Backends",
                desc: "Structured PostgreSQL, Supabase instances, and automated REST service workflows.",
              },
            ].map((box, i) => (
              <SpotlightCard
                key={i}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                {box.icon}
                <h3 className="text-base font-bold text-white">{box.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{box.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">Capabilities</div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Structured Services</h2>
          <p className="mt-4 text-slate-400 text-sm">
            Everything needed to launch, scale, and analyze digital initiatives.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((item, idx) => (
            <SpotlightCard
              key={idx}
              className="p-8 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div>{item.icon}</div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/[0.05] text-slate-400 border border-white/10">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
              <ul className="space-y-2.5">
                {item.deliverables.map((d, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-slate-400 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">Portfolio</div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Selected Works</h2>
          </div>

          <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            {[
              { id: "all", label: `All (${projects.length})` },
              { id: "shopify", label: "Shopify Stores" },
              { id: "web", label: "Web Applications" },
              { id: "data", label: "Data / AI" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilter(tab.id);
                  setShowAllProjects(false);
                }}
                className={`text-xs px-4 py-2 rounded-lg font-mono tracking-wide transition-all ${
                  filter === tab.id
                    ? "bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-400/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {displayedProjects.map((p) => {
              const preview = p.preview_url || p.link;
              const screenshotSrc = `https://image.thum.io/get/width/1200/crop/800/noanimate/${preview}`;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={p.id || p.title}
                  className="h-[430px]"
                >
                  <TiltCard className="h-full">
                    <SpotlightCard className="h-full flex flex-col justify-between p-6 rounded-2xl bg-[#0b0f19] border border-white/10 hover:border-cyan-400/50 transition-all duration-300 group relative overflow-hidden shadow-xl">
                      
                      <div className="absolute inset-0 z-0 overflow-hidden">
                        <img
                          src={screenshotSrc}
                          alt={`${p.title} screenshot`}
                          loading="lazy"
                          className="w-full h-full object-cover object-top filter brightness-[0.70] contrast-[1.05] group-hover:brightness-[0.92] group-hover:scale-105 transition-all duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#06080d] via-[#070a12]/75 to-[#070a12]/60 transition-colors duration-500" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between text-xs font-mono mb-3">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] text-cyan-300 font-semibold shadow-sm">
                            {p.metric}
                          </span>
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-black/50 backdrop-blur-md text-slate-300 hover:text-cyan-400 border border-white/10 hover:border-cyan-400/40 transition-colors"
                            aria-label={`Open ${p.title}`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        <h3 className="text-2xl font-black text-white drop-shadow-md group-hover:text-cyan-400 transition-colors tracking-tight mb-1">
                          {p.title}
                        </h3>
                        <div className="text-xs text-cyan-200/90 font-mono mb-2 drop-shadow-sm font-medium">
                          {p.tagline}
                        </div>
                        <p className="text-xs text-slate-200/90 leading-relaxed drop-shadow line-clamp-3">
                          {p.description}
                        </p>
                      </div>

                      <div className="relative z-10 pt-3">
                        <div className="flex flex-wrap gap-1.5 pb-3 border-t border-white/15">
                          {p.tech &&
                            p.tech.map((t, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-slate-200 border border-white/15 shadow-sm"
                              >
                                {t}
                              </span>
                            ))}
                        </div>

                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300 hover:text-white pt-1 group/link transition-colors drop-shadow"
                        >
                          <span className="tracking-wide">Launch Live Site</span>
                          <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>

                    </SpotlightCard>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* SHOW MORE / SHOW LESS BUTTON */}
        {filteredProjects.length > 3 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="group flex items-center gap-2.5 px-7 py-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.08] text-xs font-mono font-semibold text-slate-200 transition-all duration-300 active:scale-95 shadow-lg"
            >
              <span>
                {showAllProjects
                  ? "Show Less"
                  : `Show More Projects (${filteredProjects.length - 3} more)`}
              </span>
              {showAllProjects ? (
                <ChevronUp className="w-4 h-4 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>
        )}
      </section>

      {/* Tech Stack */}
      <section id="stack" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">Arsenal</div>
          <h2 className="text-3xl font-bold text-white">Engineered Tech Stack</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {skills.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-400/50 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-default"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{item.name}</span>
              <span className="text-[10px] text-slate-500">[{item.level}]</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section With Supabase Form & WhatsApp */}
      <footer id="contact" className="py-24 border-t border-white/10 bg-[#05070b] relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-xs mb-6 border border-cyan-500/20">
            <Activity className="w-3.5 h-3.5" /> Direct Line
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Let's build something remarkable together.
          </h2>
          <p className="mt-4 text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Need custom Shopify Liquid development, full-stack architectures, or executive BI pipelines? Reach out directly.
          </p>

          {/* WhatsApp Button */}
          <div className="mt-6 flex justify-center">
            <a
              href="https://wa.me/201024647816?text=Hi%20Mohamed,%20I%20am%20interested%20in%20working%20with%20you!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Instant WhatsApp Chat</span>
            </a>
          </div>

          <div className="my-8 flex items-center gap-4 max-w-md mx-auto">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs font-mono text-slate-500 uppercase">Or Send Project Brief</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form with Smooth Disappearing & Success Animation */}
          <div className="relative min-h-[340px]">
            <AnimatePresence mode="wait">
              {formStatus === "success" ? (
                <motion.div
                  key="success-box"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="p-10 rounded-2xl bg-[#0b0f19] border border-cyan-500/30 text-center space-y-4 shadow-2xl shadow-cyan-500/10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.15 }}
                    className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center border border-cyan-500/40"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Message Received!
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-mono">
                    Your brief has been securely transmitted. I will review the details and get back to you shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setFormStatus("idle")}
                      className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSendMessage}
                  className="text-left space-y-4"
                >
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Phone (with country code)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+20 10..."
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Project Details / Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your goals, scope, and timeline..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === "loading"}
                    className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-cyan-400/20 disabled:opacity-50"
                  >
                    {formStatus === "loading" ? "Transmitting..." : "Send Project Message"}
                  </button>

                  {formStatus === "error" && (
                    <p className="text-center text-xs font-mono text-rose-400 pt-2">
                      ✕ Transmission error. Please verify database connection or chat via WhatsApp.
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cairo, Egypt</span>
            </div>
            <div>© 2026 Mohamed Ashraf. Powered by Next.js & Supabase.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}