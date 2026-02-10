# frozen_string_literal: true

require 'rouge'

module Rouge
  module Lexers
    # KQL (Kusto Query Language) lexer for Azure Data Explorer and Log Analytics
    class KQL < Rouge::RegexLexer
      title "KQL"
      desc "Kusto Query Language (KQL) for Azure Data Explorer and Azure Monitor"
      tag 'kql'
      aliases 'kusto'
      filenames '*.kql', '*.kusto'
      mimetypes 'text/x-kql'

      def self.keywords
        @keywords ||= Set.new %w(
          and as asc between by case contains count desc distinct else
          end endswith extend false fork from has hasprefix hassuffix
          in invoke join kind let limit make-series matches mv-expand
          not nullif on or order parse parse-where print project
          project-away project-keep project-rename project-reorder range
          render sample sample-distinct search serialize sort summarize
          take top true union where with
        )
      end

      def self.operators
        @operators ||= Set.new %w(
          ago now datetime timespan bin floor ceiling round abs
          log log10 log2 exp pow sqrt tolower toupper tostring
          strcat strlen substring replace trim split
          iff iif coalesce case todynamic tobool todouble tolong
          startofday startofweek startofmonth startofyear
          endofday endofweek endofmonth endofyear
          getmonth getyear dayofweek dayofyear weekofyear
          min max sum avg count dcount percentile stdev variance
          make_list make_set any arg_max arg_min take_any
        )
      end

      def self.table_operators
        @table_operators ||= Set.new %w(
          evaluate graph mv-apply pivot join union fork
        )
      end

      state :root do
        rule %r/\s+/m, Text::Whitespace
        rule %r(//.*?$), Comment::Single
        rule %r(/\*), Comment::Multiline, :multiline_comment

        # Numbers
        rule %r/\b\d+[.]?\d*([eE][+-]?\d+)?\b/, Num::Float
        rule %r/\b0x[0-9a-fA-F]+\b/, Num::Hex
        rule %r/\b\d+\b/, Num::Integer

        # Strings
        rule %r/"([^"\\]|\\.)*"/, Str::Double
        rule %r/'([^'\\]|\\.)*'/, Str::Single
        rule %r/@"[^"]*"/, Str::Double # verbatim string
        rule %r/@'[^']*'/, Str::Single # verbatim string

        # DateTime literals
        rule %r/\b\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?/, Literal::Date

        # Table/column names with special characters
        rule %r/\[([^\]]+)\]/, Name::Variable

        # Operators and punctuation
        rule %r/[~!%^&*+=\|?:<>\/-]+/, Operator
        rule %r/[{}()\[\],.;]/, Punctuation

        # Keywords
        rule %r/\b(true|false|null|dynamic)\b/i, Keyword::Constant
        
        rule %r/\b\w+\b/ do |m|
          name = m[0].downcase
          if self.class.keywords.include?(name)
            token Keyword
          elsif self.class.operators.include?(name)
            token Name::Builtin
          elsif self.class.table_operators.include?(name)
            token Keyword::Reserved
          else
            token Name
          end
        end

        # Pipe operator (special in KQL)
        rule %r/\|/, Operator::Word
      end

      state :multiline_comment do
        rule %r(\*/), Comment::Multiline, :pop!
        rule %r([^*]+), Comment::Multiline
        rule %r(\*), Comment::Multiline
      end
    end
  end
end
