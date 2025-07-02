"use client";

import {
  FiArrowRight,
  FiCheck,
  FiBook,
  FiUpload,
  FiShare2,
  FiAward,
  FiPocket,
} from "react-icons/fi";
import { FaReact, FaNodeJs, FaPython } from "react-icons/fa";
import { SiTypescript, SiTailwindcss, SiTensorflow } from "react-icons/si";

export default function LandingPage() {
  const features = [
    {
      icon: <FiBook />,

      title: "Instant AI Explanations",

      description:
        "Get clear, step-by-step explanations for any homework problem instantly.",
    },

    {
      icon: <FiUpload />,

      title: "Upload Handwritten Work",

      description:
        "Take a photo of your handwritten or printed homework for instant help.",
    },

    {
      icon: <FiAward />,

      title: "Multiple Subjects",

      description:
        "Supports Math, Science, English, History and more school subjects.",
    },

    {
      icon: <FiCheck />,

      title: "Simple Answers",

      description:
        "No confusing jargon - just clear explanations you can understand.",
    },

    {
      icon: <FiShare2 />,

      title: "Save & Share Results",

      description: "Easily save your solutions or share them with classmates.",
    },

    {
      icon: <FiPocket />,

      title: "100% Free (Beta)",

      description: "Completely free to use during our beta testing period.",
    },
  ];

  const techStack = [
    { icon: <FaReact />, name: "React" },

    { icon: <SiTypescript />, name: "TypeScript" },

    { icon: <SiTailwindcss />, name: "Tailwind CSS" },

    { icon: <FaNodeJs />, name: "Node.js" },

    { icon: <FaPython />, name: "Python" },

    { icon: <SiTensorflow />, name: "TensorFlow" },
  ];

  const testimonials = [
    {
      quote:
        "Askelo saved me hours of frustration on my math homework. The explanations actually make sense!",

      author: "Jamie Wilson",

      role: "High School Student",
    },

    {
      quote:
        "As a parent, I love how Askelo helps my child understand concepts instead of just giving answers.",

      author: "Maria Gonzalez",

      role: "Parent",
    },

    {
      quote:
        "I use Askelo to check my work and get alternative explanations. It's like having a tutor available 24/7.",

      author: "Tyler Chen",

      role: "College Student",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}

      <section className="relative bg-gradient-to-br from-[#181C23] via-[#232B39] to-[#1E293B] text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-[#232B39] rounded-full mb-6 shadow-lg">
                  <span className="text-blue-200 font-medium">
                    Beta Version
                  </span>

                  <span className="ml-2 text-sm text-blue-300">100% Free</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-lg">
                  Askelo: AI Homework Help, Step-by-Step
                </h1>

                <p className="text-lg text-gray-300 mb-8 max-w-2xl drop-shadow">
                  Upload a photo or type your question. Get clear, step-by-step
                  answers for Math, Science, English, and more. No jargon, just
                  understanding.
                </p>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <a
                    href="#"
                    className="px-8 py-4 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white font-bold rounded-lg hover:from-[#1E40AF] hover:to-[#2563EB] transition-all shadow-xl flex items-center justify-center"
                  >
                    Try Askelo Now <FiArrowRight className="ml-2" />
                  </a>

                  <a
                    href="#"
                    className="px-8 py-4 bg-[#232B39] border border-blue-900 text-gray-200 rounded-lg hover:bg-[#181C23] transition-all flex items-center justify-center"
                  >
                    How It Works
                  </a>
                </div>

                <div className="mt-8 flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="w-10 h-10 rounded-full bg-blue-800 border-2 border-blue-900"
                        style={{
                          backgroundImage: `url(https://randomuser.me/api/portraits/${
                            item % 2 === 0 ? "women" : "men"
                          }/${item + 20}.jpg)`,

                          backgroundSize: "cover",
                        }}
                      />
                    ))}
                  </div>

                  <div className="text-blue-200">
                    <p>Trusted by 50,000+ students</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-[#232B39] bg-gradient-to-br from-[#232B39] to-[#181C23]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#232B39]/20 to-[#181C23]/20"></div>

                  <div className="relative p-1 bg-[#181C23]/80">
                    <div className="flex space-x-2 p-3 bg-blue-900 rounded-t-lg">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>

                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>

                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>

                    <div className="p-6">
                      <div className="mockup-window border border-blue-700 bg-blue-900">
                        <div className="flex justify-center bg-blue-800 p-10">
                          <div className="text-center">
                            <div className="text-4xl mb-4">📚</div>

                            <h3 className="text-xl font-semibold mb-2">
                              Askelo AI Helper
                            </h3>

                            <p className="text-blue-300">
                              Upload your homework for instant help
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>

                <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-300 rounded-full filter blur-3xl opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}

      <section className="py-20 bg-[#232B39]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              How Askelo Helps You
            </h2>

            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              The AI homework helper designed to actually help you learn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#232B39] to-[#181C23]/80 rounded-xl p-8 hover:bg-[#181C23] transition-all border border-[#232B39] hover:border-blue-800/30 shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-lg flex items-center justify-center mb-6 text-blue-200 text-2xl shadow">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold mb-3 text-white drop-shadow">
                  {feature.title}
                </h3>

                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}

      <section className="py-20 bg-gradient-to-br from-[#181C23] to-[#232B39]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Simple As 1-2-3
            </h2>

            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Get homework help in seconds with our easy-to-use platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#232B39] rounded-xl p-8 border border-[#181C23] text-center shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow">
                1
              </div>

              <h3 className="text-xl font-semibold mb-3 text-white">
                Upload Your Question
              </h3>

              <p className="text-gray-300">
                Take a photo or type your homework problem
              </p>
            </div>

            <div className="bg-[#232B39] rounded-xl p-8 border border-[#181C23] text-center shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow">
                2
              </div>

              <h3 className="text-xl font-semibold mb-3 text-white">
                Get AI Analysis
              </h3>

              <p className="text-gray-300">
                Our AI provides step-by-step explanations
              </p>
                </div>

            <div className="bg-[#232B39] rounded-xl p-8 border border-[#181C23] text-center shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow">
                3
              </div>

              <h3 className="text-xl font-semibold mb-3 text-white">
                Understand & Learn
              </h3>

              <p className="text-gray-300">
                Grasp concepts instead of just copying answers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}

      <section className="py-20 bg-[#181C23]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Powered By Advanced AI
            </h2>

            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Cutting-edge technology for accurate, helpful explanations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
            {techStack.map((tech, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center mb-3 text-blue-200 text-3xl bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-full shadow">
                  {tech.icon}
                </div>

                <span className="text-gray-300">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}

      <section className="py-20 bg-[#232B39]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              What Students & Parents Say
            </h2>

            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#232B39] to-[#181C23]/80 rounded-xl p-8 border border-[#232B39] hover:border-blue-800/30 transition-all shadow-lg"
              >
                <div className="flex items-center mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-200 italic mb-6">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1E40AF] mr-4 overflow-hidden flex items-center justify-center text-blue-200 font-bold shadow">
                      {testimonial.author.charAt(0)}
                  </div>

                  <div>
                    <h4 className="font-semibold text-white">
                      {testimonial.author}
                    </h4>

                    <p className="text-blue-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}

      <section className="py-20 bg-gradient-to-br from-[#181C23] to-[#232B39]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#232B39]/60 to-[#181C23]/60 rounded-2xl p-12 text-center border border-[#232B39] shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white drop-shadow">
              Start Learning with Askelo – Free AI Homework Help
            </h2>

            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of students getting better grades and actually
              understanding their homework.
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#"
                className="px-8 py-4 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white font-bold rounded-lg hover:from-[#1E40AF] hover:to-[#2563EB] transition-all shadow-xl flex items-center justify-center"
              >
                Get Started <FiArrowRight className="ml-2" />
              </a>

              <a
                href="#"
                className="px-8 py-4 bg-[#232B39] border border-blue-900 text-gray-200 rounded-lg hover:bg-[#181C23] transition-all flex items-center justify-center"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
