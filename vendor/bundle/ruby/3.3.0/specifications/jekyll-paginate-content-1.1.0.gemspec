# -*- encoding: utf-8 -*-
# stub: jekyll-paginate-content 1.1.0 ruby lib

Gem::Specification.new do |s|
  s.name = "jekyll-paginate-content".freeze
  s.version = "1.1.0".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Alex Ibrado".freeze]
  s.bindir = "exe".freeze
  s.date = "2018-01-27"
  s.description = "Jekyll::Paginate::Content splits pages and posts (and other collections/content) into multiple parts/URLs automatically via h1-h6 headers, or manually by inserting something like  <!--page--> where you want page breaks. Features: Automatic content splitting into several pages, single-page view, configurable permalinks, page trail/pager, SEO support, self-adjusting internal links, multipage-aware Table Of Contents.".freeze
  s.email = ["alex@ibrado.org".freeze]
  s.homepage = "https://github.com/ibrado/jekyll-paginate-content".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 2.1.0".freeze)
  s.rubygems_version = "2.5.1".freeze
  s.summary = "Jekyll::Paginate::Content: Easily split Jekyll pages, posts, etc. into multiple URLs".freeze

  s.installed_by_version = "3.6.7".freeze

  s.specification_version = 4

  s.add_runtime_dependency(%q<jekyll>.freeze, ["~> 3.0".freeze])
  s.add_development_dependency(%q<bundler>.freeze, ["~> 1.16".freeze])
end
