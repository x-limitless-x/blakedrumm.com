# -*- encoding: utf-8 -*-
# stub: jgd 1.12 ruby lib

Gem::Specification.new do |s|
  s.name = "jgd".freeze
  s.version = "1.12"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Yegor Bugayenko".freeze]
  s.date = "2019-06-21"
  s.description = "Automated deployment of your Jekyll blog to Github Pages".freeze
  s.email = "yegor256@gmail.com".freeze
  s.executables = ["jgd".freeze]
  s.extra_rdoc_files = ["README.md".freeze, "LICENSE.txt".freeze]
  s.files = ["LICENSE.txt".freeze, "README.md".freeze, "bin/jgd".freeze]
  s.homepage = "http://github.com/yegor256/jekyll-github-deploy".freeze
  s.licenses = ["MIT".freeze]
  s.rdoc_options = ["--charset=UTF-8".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 2.3".freeze)
  s.rubygems_version = "3.4.20".freeze
  s.summary = "Jekyll Github Deploy".freeze

  s.installed_by_version = "3.4.20" if s.respond_to? :installed_by_version

  s.specification_version = 2

  s.add_runtime_dependency(%q<jekyll>.freeze, [">= 1.5.1"])
  s.add_runtime_dependency(%q<trollop>.freeze, ["= 2.9.9"])
  s.add_development_dependency(%q<rake>.freeze, ["= 12.3.1"])
  s.add_development_dependency(%q<rubocop>.freeze, ["= 0.62.0"])
  s.add_development_dependency(%q<rubocop-rspec>.freeze, ["= 1.31.0"])
end
